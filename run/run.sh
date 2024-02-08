function ctrl_c() {
  printf "\n"
  printf '==========================================================================\n'
  printf '=========== DOCKER COMPOSE DOWN AFTER CTRL+C =================\n'
  printf '==========================================================================\n'
  printf "\n"
  docker-compose -f $PWD/run/docker-compose.yml --env-file .env.development down
  exit
}
trap ctrl_c INT

docker-compose -f $PWD/run/docker-compose.yml --env-file .env.development up --build

ctrl_c