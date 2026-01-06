import FormData from "form-data";
import Mailgun from "mailgun.js";
import crypto from 'crypto';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config()

const storage = multer.diskStorage({  
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
const imageFilter = function (req, file, cb) {

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
export const upload = multer({ storage: storage, fileFilter: imageFilter})

export async function sendSimpleMessage(to, subject, template, args) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "API_KEY",
    url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create("websiteswithpassion.pl", {
      from: args?.title ? "Admin <admin@websiteswithpassion.pl>" : "Cookiety <admin@cookiety.pl>",
      to,
      subject,
      html: template(args),
    });

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

export const hashEmail = (email) =>
  crypto.createHash('sha256').update(email).digest('hex');

export function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Zaloguj się, by kontynuować");
    res.redirect(`/login?return_route=${req._parsedOriginalUrl.path}`);
}

export function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const algorithm = 'aes-256-gcm';

export const encrypt = (text) => {
  if(text){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  }
};

export const decrypt = (encryptedText) => {
  if(encryptedText){
    const [ivHex, encrypted, authTagHex] = encryptedText?.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
};