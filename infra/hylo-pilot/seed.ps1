param([switch]$ConfirmEmptyPilot)

$ErrorActionPreference = 'Stop'
if (-not $ConfirmEmptyPilot) { throw 'Seed only a newly initialized, disposable pilot database. Re-run with -ConfirmEmptyPilot after verifying the target.' }
$here = $PSScriptRoot
$compose = Join-Path $here 'compose.yaml'
$counts = docker exec community-hylo-pilot-database-1 psql -U hylo -d hylo -tAc 'SELECT (SELECT count(*) FROM users), (SELECT count(*) FROM groups), (SELECT count(*) FROM posts), (SELECT count(*) FROM linked_account), (SELECT count(*) FROM groups_posts), (SELECT count(*) FROM groups_roles), (SELECT count(*) FROM responsibilities), (SELECT count(*) FROM tags), (SELECT count(*) FROM knex_migrations);'
if ($LASTEXITCODE -ne 0 -or "$counts".Trim() -ne '0|0|0|0|0|0|0|0|0') { throw 'The pilot database is not empty or could not be checked; refusing to seed.' }
# This upstream seed removes existing records. It is permitted only on the empty pilot above.
# The pinned upstream seed references an absent groups_posts.active column; patch only the temporary container.
docker compose --project-directory $here -f $compose run --rm --no-deps backend sh -c 'sed -i "s/post_id: 1, active: true/post_id: 1/" seeds/groups.js && yarn knex seed:run'
if ($LASTEXITCODE -ne 0) { throw 'Pilot seed failed; inspect the pilot database before trying again.' }
