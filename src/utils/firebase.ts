import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, onSnapshot, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { Product } from "../types/products";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged
} from "firebase/auth";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



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


const addProduct = async (product: Omit<Product, "id">) => {
  try {
    const where = collection(db, "products");
    await addDoc(where, { ...product, createdAt: new Date() }); // add createdAt field
    console.log("se añadió con éxito");
  } catch (error) {
    console.error(error);
  }
};


const getProducts = async () => {
  const q = query(collection(db, "products"), orderBy("createdAt")); // order by createdAt
  const querySnapshot = await getDocs(q);
  const transformed: Array<Product> = [];

  querySnapshot.forEach((doc) => {
    const data: Omit<Product, "id"> = doc.data() as any;
    transformed.push({ id: doc.id, ...data });
  });

  return transformed;
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

const getProductsListener = (cb: (docs: Product[]) => void) => {
  const q = query(collection(db, "products"), orderBy("createdAt")); // order by createdAt
  onSnapshot(q, (collection) => {
    const docs: Product[] = collection.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    cb(docs);
  });
};

export {auth}
export {db}
export default {
  addProduct,
  getProducts,
  getProductsListener,
  registerUser,
  loginUser,
};