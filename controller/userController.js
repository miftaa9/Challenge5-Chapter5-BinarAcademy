const { users, shops } = require('../models');

// import bcrypt untuk authentication
const bcrypt = require('bcrypt');

// import jsonwebtoken sbg authorization
const jwt = require('jsonwebtoken');

// untuk menampilkan user
async function getUsers(req, res) {
    try {
        const data = await users.findAll();

        res.status(200).json({
            status: 'success',
            data
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

// untuk mencari user berdasarkan id
async function getUserById(req, res) {
    try {
        // Primary Key = PK
        const id = req.params.id;
        const data = await users.findByPk(id, {
            include: {
                model: shops,
                // attributes: ['name']
            }
        });

        // validasi bila id yg dicari gak ada
        if (data) {
            res.status(200).json({
                status: 'success',
                data
            })
        } else {
            res.status(404).json({
                status: 'failed',
                message: `id ${id} belum terdaftar`
            })
        }
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

// untuk edit data user
async function editUser(req, res) {
    try {
        const { username } = req.body;
        const id = req.params.id;

        await users.update({
            username
        }, {
            where: { id }
        })

        // validasi jika username kurang dari 4 karakter, maka edit gagal
        if(username.length > 8){
            res.status(200).json({
                status: 'success',
                message: `username dari id ${id} nya berhasil berubah`
            })
        } else {
            res.status(400).json({
                status: 'failed',
                message: `username ${username} tidak boleh kurang dari 4 karakter`
            })

        }
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

// untuk menghapus data user
async function deleteUser(req, res) {
    try {
        const id = req.params.id
        await users.destroy({
            where: {
                id
            }
        })

        res.status(200).json({
            'status': 'success',
            'message': `data dari ${id} berhasil di hapus`
        })
    } catch (err) {
        res.status(400).message(err.message)
    }
}

// untuk menambah user baru/ register
async function createUser(req, res) {
    try {
        const { username, password } = req.body

        // bungkus password pake bcrypt / proses enkripsi password
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await users.create({
            username,
            password: hashedPassword,
            role: req.body.role
        })
        
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })

        // validasi username unique
        const name = await username.length
        const notAvailable = await users.findOne({
            where: {
                username
            }
        })

        if(notAvailable) {
            res.status(400).json({
                status: "failed",
                message: `Data dengan username ${username} telah digunakan`,
              });
        } else if(name > 18) {
            res.status(400).json({
                status: "failed",
                message: `Username anda terlalu panjang`,
              });
        }
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

// login
async function login(req, res) {
    try {
        const {
            username,
            password
        } = req.body

        // cari user berdasarkan username
        const user = await users.findOne({
            where: {
                username
            }
        })

        // validasi kalau username ga ada
        if (!user) {
            res.status(404).json({
                status: 'failed',
                message: `user ${username} gak ketemu`
            })
        }

        // check password dari request body sesuai gak sama hashed password dari database
        if (user && bcrypt.compareSync(password, user.password)) {

            // generate TOKEN untuk user
            const token = jwt.sign({
                id: user.id,
                username: user.username,
                role: user.role
            }, 'rahasia')

            res.status(200).json({
                status: 'success',
                data: {
                    user,
                    token
                }
            })
        }
        
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

module.exports = {
    getUsers,
    getUserById,
    deleteUser,
    editUser,
    createUser,
    login,
}