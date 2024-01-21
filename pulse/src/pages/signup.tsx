// @ts-nocheck
import React, {useState} from 'react'
import { auth } from '~/utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AuthDetails from '~/components/authDetails';
import { userInfo } from 'os';
export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword ] = useState("");
    const [signUp, changeSignUp] = useState(true);
    const [user, setUser] = useState(null);
    // if (typeof window !== "undefined") {setUser(localStorage.getItem("profile"))}
const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signUp) {
        createUserWithEmailAndPassword(auth, email, password).then((userCredentials) => {
            console.log(userCredentials);
            localStorage.setItem("profile", JSON.stringify(userCredentials));
            setUser(localStorage.getItem("profile"))
        })
        .catch((error) => {
            console.log(error)
        })
    }
    else {
        signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {
            console.log(userCredentials);
            localStorage.setItem("profile", JSON.stringify(userCredentials));
            setUser(localStorage.getItem("profile"))
        })
        .catch((error) => {
            console.log(error)
        })
    }
}
const signOut = () => {
    localStorage.removeItem("profile");
    setUser(null)
}
if (user != null) {
    return (
        <div className="flex h-[100vh] justify-center items-center">
             <div className="flex h-full items-center justify-center w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <button onClick={signOut} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign Out</button>
            </div>
        </div>
       
    )
}
  return (
    <>
    <header className="bg-[#ff4d6e] py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-white text-4xl font-extrabold font-pacifico">PULSE</h1>
          <nav className="flex space-x-10 text-l">
            <a href="/" className="text-white hover:underline">Home</a>
            <a href="/aboutus" className="text-white hover:underline">About Us</a>
          </nav>
        </div>
      </header>
    <div className="flex h-screen bg-gradient-to-b from-[#ff4d6e] to-[#2e026d] justify-center items-center">
        
    <div className="w-full rounded-lg md:mt-0 sm:max-w-md">
    <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #ff4d6e; /* Vibrant pink background */
          color: #fff; /* White text */
        }
      `}</style>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl dark:text-white">
                  {(signUp) ? "Sign Up" : "Sign In"}
              </h1>
              <form onSubmit={submitForm} className="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                  </div>
                  <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                  </div>
            
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{(signUp) ? "Sign Up" : "Sign In"}</button>
              </form>
              <p onClick={()=>changeSignUp(!signUp)} className="text-sm justify-center font-light text-white">
                     <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">{(signUp) ? "Sign In Instead" : "Sign Up Instead"}</a>
            </p>
          </div>
    </div>
    </div>
    </>
  )
}
