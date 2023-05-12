import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { Product } from "../types/products";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCwASHmt8O1HvxtZuTc5d_NMaoHEIYPTlo",
  authDomain: "prueba2-eaacd.firebaseapp.com",
  projectId: "prueba2-eaacd",
  storageBucket: "prueba2-eaacd.appspot.com",
  messagingSenderId: "472325824028",
  appId: "1:472325824028:web:ef0cd539d7ef2dcacac9d9"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const registerUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<boolean> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential.user);
    return true;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return false;
  }
};

const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  setPersistence(auth, browserSessionPersistence)
  .then(() => {
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
};

/////////////////////// DB
const db = getFirestore(app);

const addProduct = async (product: Omit<Product, "id">) => {
  try {
    const where = collection(db, "products");
    await addDoc(where, product);
    console.log("se añadió con éxito");
  } catch (error) {
    console.error(error);
  }
};

const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  const transformed: Array<Product> = [];

  querySnapshot.forEach((doc) => {
    const data: Omit<Product, "id"> = doc.data() as any;
    transformed.push({ id: doc.id, ...data });
  });

  return transformed;
};

export default {
  addProduct,
  getProducts,
  registerUser,
  loginUser,
};

//Register new user
createUserWithEmailAndPassword(auth, 'fandango981@gmail.com', '1234567')
.then((userCredential:any) => {
	// Signed in
	const user = userCredential.user;
	console.log(user);
	// ...
})
.catch((error:any) => {
	const errorCode = error.code;
	const errorMessage = error.message;
	console.log(errorMessage);
	// ..
});

//Login user
signInWithEmailAndPassword(auth, 'fandango981@gmail.com', '1234567')
.then((userCredential:any) => {
	const user2 = userCredential.user;
	console.log(user2);

})
.catch((error:any) => {
	const errorCode = error.code;
	const errorMessage = error.message;
});

onAuthStateChanged(auth, (user:any) => {
	if (user) {

		const uid = user.uid;
		console.log(uid);
	
	} else {
	
	}
});