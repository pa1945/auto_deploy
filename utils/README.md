#
$  docker-compose up -d
Must run from inside 'utils' folder
where is located:
utils $ cat docker-compose.yml 

#
Or,
$ pm2 start docker-compose up	# Does not work
#
cdond-c3-projectstarter $ pm2 start 'docker-compose up -d'
[PM2] Starting /bin/bash in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 3  │ docker-compose up… │ fork     │ 0    │ online    │ 0%       │ 1.2mb    │
│ 1  │ node               │ fork     │ 0    │ online    │ 0%       │ 32.5mb   │
│ 0  │ npm                │ fork     │ 2141 │ online    │ 116.7%   │ 40.2mb   │
│ 2  │ npm start          │ fork     │ 0    │ stopped   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
cdond-c3-projectstarter $ 

Test DB:
backend $ psql --host=localhost --port=5532 --username=postgres \
 --password --dbname=glee
