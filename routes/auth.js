let express = require('express');
let router = express.Router()
let userController = require('../controllers/users')
let bcrypt = require('bcrypt');
const { CheckLogin } = require('../utils/authHandler');
let jwt = require('jsonwebtoken')
const path = require('path')
const { validatedResult, ChangePasswordValidator } = require('../utils/validator')
const { loadPemKey } = require('../utils/keyLoader')

function getPrivateKey() {
    return loadPemKey({
        envName: 'JWT_PRIVATE_KEY',
        filePath: path.join(__dirname, '..', 'keys', 'private.pem'),
        label: 'JWT private key'
    })
}
router.post('/register', async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let newUser = await userController.CreateAnUser(username, password, email,
            "69b1265c33c5468d1c85aad8"
        )
        res.send(newUser)
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
})

router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let user = await userController.GetAnUserByUsername(username);
        if (!user) {
            res.status(404).send({
                message: "thong tin dang nhap khong dung"
            })
            return;
        }
        if (user.lockTime > Date.now()) {
            res.status(404).send({
                message: "ban dang bi ban"
            })
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            await user.save()
            let privateKey = getPrivateKey();
            let token = jwt.sign({
                id: user._id
            }, privateKey, {
                expiresIn: '1d',
                algorithm: 'RS256'
            })
            res.send(token)
        } else {
            user.loginCount++;
            if (user.loginCount == 3) {
                user.loginCount = 0;
                user.lockTime = Date.now() + 3600 * 1000;
            }
            await user.save()
            res.status(404).send({
                message: "thong tin dang nhap khong dung"
            })
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
})
router.get('/me', CheckLogin, function (req, res, next) {
    res.send(req.user)
})

async function changePasswordHandler(req, res, next) {
    try {
        let { oldPassword, newPassword } = req.body;
        if (!bcrypt.compareSync(oldPassword, req.user.password)) {
            res.status(400).send({
                message: "oldPassword khong chinh xac"
            })
            return;
        }
        req.user.password = newPassword;
        await req.user.save();
        res.send({
            message: "doi mat khau thanh cong"
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}
router.post('/change-password', CheckLogin, ChangePasswordValidator, validatedResult, changePasswordHandler)
router.post('/changepassword', CheckLogin, ChangePasswordValidator, validatedResult, changePasswordHandler)
module.exports = router
