import crypto from 'crypto'

//* Password: "L1234567"
const store =  [{email: "pepetukis@email.com",
                password: "28aae349438a8330cdb00319314ed46d:7932471ca23046cdf16545d1226d9263b72212fcea1b6367341f3ca46650db5d686a9e26168ab1316f2bdee84962abda921c01160c24aba08ced43cbad2a09af"} 
               ]

               function hashPassword(password) {
                return new Promise((resolve, reject) => {
                    const salt = crypto.randomBytes(16).toString('hex');
                    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                        if (err) reject(err);
                        resolve(salt + ':' + derivedKey.toString('hex'));
                    });
                });
            }
            
          
            function verifyPassword(password, hash) {
                return new Promise((resolve, reject) => {
                    const [salt, key] = hash.split(':');
                    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                        if (err) reject(err);
                        resolve(key === derivedKey.toString('hex'));
                    });
                });
            }
export default {


verifyPassword : async(password, hash)=> {
    return bcrypt.compare(password, hash);
},
userRegister: async(email, password1)=>{
  const userFound = store.find((user) =>user.email === email)
  if(userFound){const error = new Error('The user already exists'); error.status = 400; throw error}
  const password = await hashPassword(password1);
  const user = {email, password}
  store.push(user)
  return user;

}, 
userLogin : async(email, password)=>{
 const userFound = store.find((user) =>user.email === email)
 if(!userFound){const error = new Error('User not found'); error.status = 404; throw error}
 const passwordMatch = await verifyPassword(password, userFound.password);
 if(!passwordMatch){const error = new Error('Invalid password'); error.status= 400; throw error}
 return userFound
    
}
}