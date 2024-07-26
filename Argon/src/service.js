import argon2 from 'argon2'

//* Password: "L1234567"
const store =  [{email: "pepetukis@email.com",
                password: "$argon2id$v=19$m=65536,t=3,p=4$d4NdmBkKM4cDaO3+aFQ3PA$5eKgfgAvdyczXoEiovyvH4EooV92wbd0auWFPNiyuxY"} 
               ]

export default {
userRegister: async(email, password1)=>{
  const userFound = store.find((user) =>user.email === email)
  if(userFound){const error = new Error('The user already exists'); error.status = 400; throw error}
  const password = await argon2.hash(password1)
  const user = {email, password}
  store.push(user)
  return user;

}, 
userLogin : async(email, password)=>{
 const userFound = store.find((user) =>user.email === email)
 if(!userFound){const error = new Error('User not found'); error.status = 404; throw error}
 const passwordMatch = await argon2.verify(userFound.password, password);
 if(!passwordMatch){const error = new Error('Invalid password'); error.status= 400; throw error}
 return userFound
    
}
}