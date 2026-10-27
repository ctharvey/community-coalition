// Local synthetic smoke test only. Never point this script at a real database.
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const knex = require('knex')({client:'pg', connection:process.env.DATABASE_URL})
const base = 'http://127.0.0.1:3001/noo/graphql'

async function request (query, variables, cookie) {
  const headers = {'content-type':'application/json', origin:'http://localhost:3330'}
  if (cookie) headers.cookie = cookie
  const response = await fetch(base, {method:'POST', headers, body:JSON.stringify({query,variables})})
  const body = await response.json()
  if (!response.ok || body.errors) throw new Error('GraphQL request failed: ' + JSON.stringify(body.errors || response.status))
  return {data:body.data, cookie:response.headers.getSetCookie().map(x=>x.split(';')[0]).join('; '), cors:response.headers.get('access-control-allow-origin')}
}

async function main () {
  if (!process.env.DATABASE_URL?.includes('@database:5432/hylo') || process.env.NODE_ENV !== 'development') throw new Error('Refusing to run outside the isolated pilot database.')
  const email = `pilot-${crypto.randomBytes(8).toString('hex')}@example.invalid`
  const password = crypto.randomBytes(24).toString('base64url')
  await knex('users').insert({email,name:'Pilot Test Organizer',active:true,email_validated:true,created_at:new Date()})
  const user = await knex('users').select('id').where({email}).first()
  if (!user?.id) throw new Error('Synthetic user was not created.')
  await knex('linked_account').insert({user_id:user.id,provider_key:'password',provider_user_id:await bcrypt.hash(password,10)})
  const query='mutation($email:String,$password:String){login(email:$email,password:$password){error me{id}}}'
  const bad=await request(query,{email,password:'wrong'})
  if (bad.data.login.me || !bad.data.login.error) throw new Error('Incorrect password was accepted.')
  const good=await request(query,{email,password})
  if (!good.data.login.me?.id || !good.cookie || good.cors !== 'http://localhost:3330') throw new Error(`Login smoke test failed: identity=${Boolean(good.data.login.me?.id)}, cookie=${Boolean(good.cookie)}, cors=${good.cors}, error=${good.data.login.error || 'none'}`)
  const me=await request('{ me { id } }',{},good.cookie)
  if (String(me.data.me?.id)!==String(good.data.login.me.id)) throw new Error('Session identity mismatch.')
  const slug='pilot-'+crypto.randomBytes(6).toString('hex')
  const created=await request('mutation($data:GroupInput){createGroup(data:$data){id name}}',{data:{name:'Pilot group A',slug,visibility:0,accessibility:0}},good.cookie)
  if (!created.data.createGroup?.id) throw new Error('Could not create synthetic group A.')
  const emailB=`pilot-${crypto.randomBytes(8).toString('hex')}@example.invalid`
  const passwordB=crypto.randomBytes(24).toString('base64url')
  await knex('users').insert({email:emailB,name:'Pilot Test Organizer B',active:true,email_validated:true,created_at:new Date()})
  const userB=await knex('users').select('id').where({email:emailB}).first()
  await knex('linked_account').insert({user_id:userB.id,provider_key:'password',provider_user_id:await bcrypt.hash(passwordB,10)})
  const other=await request(query,{email:emailB,password:passwordB})
  if (!other.data.login.me?.id || !other.cookie) throw new Error('Second synthetic login failed.')
  let denied=false
  try {
    const result=await request('mutation($id:ID,$changes:GroupInput){updateGroup(id:$id,changes:$changes){id name}}',{id:created.data.createGroup.id,changes:{name:'Unauthorized edit'}},other.cookie)
    denied=!result.data.updateGroup
  } catch (error) {
    if (!/permission|authoriz|forbidden|not a (member|moderator|steward)|access denied/i.test(error.message)) throw error
    denied=true
  }
  if (!denied) throw new Error('A different synthetic user was able to edit group A.')
  const ownerView=await request('query($id:ID){group(id:$id){id name}}',{id:created.data.createGroup.id},good.cookie)
  if (ownerView.data.group?.name !== 'Pilot group A') throw new Error('Group A changed unexpectedly.')
  await request('mutation { logout { success } }',{},good.cookie)
  const loggedOut=await request('{ me { id } }',{},good.cookie)
  if (loggedOut.data.me) throw new Error('Session remained authenticated after logout.')
  console.log('Synthetic password login, CORS, session identity, wrong-password rejection, logout, and cross-user group-edit denial passed.')
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>knex.destroy())
