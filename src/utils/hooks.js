import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import toast from "react-hot-toast";

export async function recupererProduits(minPrice = 0, maxPrice = 1000000) {
  // console.log(minPrice, maxPrice);
  const q = query(
    collection(db, "produits"),
    where("prixReference", ">=", minPrice),
    where("prixReference", "<=", maxPrice),
    where("enStock", "==", true)
  );
  const data = await getDocs(q);
  // console.log(data);
  // console.log("kksksksks", data);
  const filteredData = data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  // console.log(filteredData);
  return filteredData;
}

export async function recupererProduitsAdmin() {
  // console.log("idid");
  const q = query(collection(db, "produits"));

  const data = await getDocs(q);

  const filteredData = data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  // console.log(filteredData);
  return filteredData;
}

export async function recupererProduitsParCategorie(
  categorie,
  minPrice,
  maxPrice
) {
  // Create the query with multiple conditions
  // console.log(categorie, minPrice, maxPrice);
  try {
    let q = query(
      collection(db, "produits"),
      where("sousCategorie", "==", categorie.toLowerCase()),
      where("prixReference", ">=", minPrice),
      where("prixReference", "<=", maxPrice),
      where("enStock", "==", true)
    );
    const data = await getDocs(q);

    const filteredData = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log(filteredData);
    return filteredData;
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
}

export const recupererProduit = async (nomP) => {
  // console.log(nomP);
  let q = query(collection(db, "produits"), where("enStock", "==", true));
  const querySnapshot = await getDocs(q);

  const filteredData = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((doc) => {
      return doc.nom.includes(nomP.toLowerCase());
    });
  // console.log(filteredData);
  return filteredData;
};

export async function recuperProduitParId(id) {
  const produitsRef = doc(db, "produits", id);
  try {
    const docSnap = await getDoc(produitsRef);
    const data = { id: docSnap.id, ...docSnap.data() };

    return data;
  } catch (error) {
    toast.error(error.code);
  }
}

export async function recuperImages() {
  const customRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
  try {
    const docSnap = await getDoc(customRef);
    const data = docSnap.data();
    // console.log(data);
    return data;
  } catch (error) {
    toast.error(error.code);
  }
}

export const recupererRecentsGO = async () => {
  const q = query(
    collection(db, "produits"),
    where("categorie", "==", "gros oeuvre"),
    where("enStock", "==", true),
    orderBy("createdAt", "desc"),
    limit(8)
  );
  try {
    const data = await getDocs(q);
    // console.log(data);
    const filteredData = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log(filteredData);
    return filteredData;
  } catch (error) {
    console.error("Error fetching recent products:", error);
    throw new Error("Unable to retrieve recent products");
  }
};

export const recupererRecentsSO = async () => {
  // console.log("keicua emememem");
  const q = query(
    collection(db, "produits"),
    where("categorie", "==", "second oeuvre"),
    where("enStock", "==", true),
    orderBy("createdAt", "desc"),
    limit(8)
  );
  try {
    const data = await getDocs(q);
    // console.log(data);
    const filteredData = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log(filteredData);
    return filteredData;
  } catch (error) {
    // console.error("Error fetching recent products:", error);
    throw new Error("Unable to retrieve recent products");
  }
};

export async function recuperComments(produit) {
  const produitsRef = doc(db, "produits", produit.id);
  try {
    const docSnap = await getDoc(produitsRef);
    const commentaires = docSnap.data().commentaires || [];
    // console.log(commentaires);
    return commentaires;
  } catch (error) {
    toast.error(error.code);
  }
}

export async function recupererProduitClient({ request }) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q");
  try {
    let q = query(collection(db, "produits"), where("enStock", "==", true));
    const querySnapshot = await getDocs(q);

    const filteredData = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) => {
        return doc.nom.includes(searchTerm.toLowerCase());
      });

    return filteredData;
  } catch (error) {
    alert(error);
  }
}

export async function recuperCommandes() {
  try {
    const q = query(collection(db, "commandes"), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return filteredData;
  } catch (error) {
    toast.error(error.code);
  }
}

export async function recuperFactures() {
  try {
    const q = query(collection(db, "factures"), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return filteredData;
  } catch (error) {
    toast.error(error.code);
  }
}

export async function recuperUtilisateurs() {
  try {
    const q = query(
      collection(db, "users"),
      where("emailVerified", "==", true),
      orderBy("createdAt", "desc")
    );
    // console.log("ici");
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log(filteredData);
    return filteredData;
  } catch (error) {
    toast.error(error.code);
    // console.log(error);
  }
}

export async function recupererProduitsFav(clientId) {
  const q = query(collection(db, "produits"));

  const data = await getDocs(q);

  const filteredData = data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  // console.log(clientId);
  // console.log(filteredData);
  const realData = filteredData.filter((res) =>
    res.favoris.includes(clientId.id)
  );
  // console.log(realData);
  return realData;
}

export async function recuperCommandesEnCours(id) {
  try {
    const q = query(
      collection(db, "commandes"),
      where("status", "==", "en cours"),
      where("idClient", "==", id),
      orderBy("createdAt", "desc")
    );
    // console.log(id);
    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log(filteredData);
    return filteredData;
  } catch (error) {
    // console.log(error);
    toast.error(error.message);
  }
}

export async function recuperCommandesLivre(id) {
  try {
    const q = query(
      collection(db, "commandes"),
      where("status", "==", "livre"),
      where("idClient", "==", id),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const filteredData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return filteredData;
  } catch (error) {
    toast.error(error.code);
  }
}

export const getCoupons = async () => {
  try {
    const couponsCollection = collection(db, "coupons");
    const q = query(couponsCollection, orderBy("nom", "asc"));
    const response = await getDocs(q);
    const couponData = response.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return couponData;
  } catch (error) {
    toast.error(error.message);
  }
};
