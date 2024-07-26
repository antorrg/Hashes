import bcrypt from 'bcryptjs'

//* Password: "L1234567"
const store =  [{email: "pepetukis@email.com",
                password: "$2a$10$ZJHXEJnxMRXHEiXnl8omz.GO3lq4p2E6axOMI/r7N6EMJYw60JknC"} //L1234567
               ]

export default {

userRegister: async(email, password1)=>{
  const userFound = store.find((user) =>user.email === email)
  if(userFound){const error = new Error('The user already exists'); error.status = 400; throw error}
  const password = await bcrypt.hash(password1, 10)
  const user = {email, password}
  store.push(user)
  return user;

}, 
userLogin : async(email, password)=>{
 const userFound = store.find((user) =>user.email === email)
 if(!userFound){const error = new Error('User not found'); error.status = 404; throw error}
 const passwordMatch = await bcrypt.compare(password, userFound.password);
 if(!passwordMatch){const error = new Error('Invalid password'); error.status= 400; throw error}
 return userFound
    
}
}