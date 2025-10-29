Pinto.


1. copy .env.example to .env and fill values
2. npm install
3. npm run dev


Endpoints:
- POST /auth/connect/:provider -> returns url to start OAuth (dev mode returns simulated)
- GET /auth/callback/:provider -> handles callback
- POST /v1/notes/list -> unified notes list; body: { source: 'notion', authKey: '<userAuthKey>' }