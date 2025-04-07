
## authRouter
- POST /login
- POST /Signup
- POST /logout

## profileRouter
- GET /profile
- PATCH /profile/edit
- PATCH /profile/password

## requestSendRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:userId
- POST /request/send/rejected/:userId

## userRouter
- GET /user/connections
- GET /user/feed
- GET /user/match
- GET /user/requests
