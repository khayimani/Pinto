# quick manual test script (bash)
# 1) start server
# 2) ./tests/quicktest.sh


BASE="http://localhost:3000"


# get connect url
curl -s -X POST "$BASE/auth/connect/notion" | jq


# simulate callback
curl -s "$BASE/auth/callback/notion?code=dev_code_simulated" | jq


# take returned pintoAuthKey and call notes.list
# curl -s -X POST -H 'Content-Type: application/json' -d '{"source":"notion","authKey":"<key>"}' $BASE/v1/notes/list | jq