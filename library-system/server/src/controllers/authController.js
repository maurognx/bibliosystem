const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const connection = await pool.getConnection();

    try {
        // Check if registration is allowed
        const [settings] = await connection.query("SELECT setting_value FROM system_settings WHERE setting_key = 'allow_registration'");
        const isRegistrationAllowed = settings.length > 0 ? settings[0].setting_value === 'true' : true;

        if (!isRegistrationAllowed) {
            return res.status(403).json({ error: 'O cadastro de novos usuários está desativado pelo administrador.' });
        }

        // Check if user exists
        const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        // 2. Hash Password
        const passwordHash = await bcrypt.hash(password, 10);

        // 3. Generate OTP Secret
        const otpSecret = authenticator.generateSecret();

        // 4. Save User
        const [result] = await connection.query(
            'INSERT INTO users (name, email, password_hash, otp_secret, otp_enabled) VALUES (?, ?, ?, ?, ?)',
            [name, email, passwordHash, otpSecret, true] // Enabling OTP by default for this requirement
        );

        // 5. Generate QR Code
        const otpauth = authenticator.keyuri(email, 'BiblioSystem', otpSecret);
        const qrCodeUrl = await qrcode.toDataURL(otpauth);

        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            userId: result.insertId,
            qrCodeUrl // Send this to frontend to display to user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    } finally {
        connection.release();
    }
};

exports.login = async (req, res) => {
    const { email, password, otp } = req.body;
    const connection = await pool.getConnection();

    try {
        // 1. Find User
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        const user = users[0];

        // 2. Check Password
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // 3. Verify OTP (if enabled)
        if (user.otp_enabled) {
            if (!otp) {
                return res.status(403).json({ error: 'Código OTP necessário', requireOtp: true });
            }

            const isValid = authenticator.check(otp, user.otp_secret);
            if (!isValid) {
                return res.status(401).json({ error: 'Código OTP incorreto.' });
            }
        }

        // 4. Success (In a real app, generate JWT here)
        res.json({
            message: 'Login realizado com sucesso!',
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no login.' });
    } finally {
        connection.release();
    }
};
