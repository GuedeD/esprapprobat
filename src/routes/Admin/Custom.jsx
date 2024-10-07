import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import SimpleLoader from "../../components/SimpleLoader";
import { BsFillCloudUploadFill } from "react-icons/bs";
import toast from "react-hot-toast";
import Aloading from "../../assets/Images/animation/ALoading.json";
import Resizer from "react-image-file-resizer";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { recuperImages } from "../../utils/hooks";
import Lottie from "lottie-react";

const Custom = () => {
  const {
    data: allImages,
    error,
    isLoading,
    refetch: refreshImages,
  } = useQuery({
    queryKey: ["allImages"],
    queryFn: recuperImages,
    staleTime: 60 * 60 * 1000,
    enabled: true,
  });

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000, // max width
        1000, // max height
        "JPEG", // format (can be PNG, JPEG, WEBP)
        100, // quality percentage
        0, // rotation
        (blob) => {
          resolve(blob);
        },
        "blob" // output type as blob
      );
    });

  const resizeFile2 = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500, // max width
        500, // max height
        "JPEG", // format (can be PNG, JPEG, WEBP)
        90, // quality percentage
        0, // rotation
        (blob) => {
          resolve(blob);
        },
        "blob" // output type as blob
      );
    });

  const [imageAssetBanner, setImageAssetBanner] = useState("");

  const [loaderBanner, setLoaderBanner] = useState(false);

  const [imageAssetCategorie1, setImageAssetCategorie1] = useState("");
  const [loaderCategorie1, setLoaderCategorie1] = useState(false);

  const [imageAssetCategorie2, setImageAssetCategorie2] = useState("");
  const [loaderCategorie2, setLoaderCategorie2] = useState(false);

  const [imageAssetCategorie3, setImageAssetCategorie3] = useState("");
  const [loaderCategorie3, setLoaderCategorie3] = useState(false);

  const [imageAssetCategorie4, setImageAsseCategorie4] = useState("");
  const [loaderCategorie4, setLoaderCategorie4] = useState(false);

  useEffect(() => {
    if (allImages) {
      setImageAssetBanner(allImages.banner);
      setImageAssetCategorie1(allImages.categorie1);
      setImageAssetCategorie2(allImages.categorie2);
      setImageAssetCategorie3(allImages.categorie3);
      setImageAsseCategorie4(allImages.categorie4);
    }
  }, [allImages]);
  // console.log("banner", imageAssetBanner);
  // console.log("categorie 2", imageAssetCategorie2);

  async function uploadImageBanner(e) {
    setLoaderBanner(true);

    const imageFile = e.target.files[0];

    const storageRef = ref(
      storage,
      `ImagesCustom/${Date.now()}-${imageFile.name}`
    );

    const image = await resizeFile(imageFile);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        toast.error(error);
        setTimeout(() => {
          setLoaderBanner(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setImageAssetBanner(downloadURL);
          setLoaderBanner(false);
          try {
            const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
            await updateDoc(collectionRef, { banner: downloadURL });
            toast.success("Nouvelle photo: Banner");
          } catch (error) {
            toast.error(error.message);
          }
        });
      }
    );
  }
  const deleteImageBanner = () => {
    const deleteRef = ref(storage, imageAssetBanner);
    deleteObject(deleteRef).then(async () => {
      setImageAssetBanner(null);
      setLoaderBanner(false);
      try {
        const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
        await updateDoc(collectionRef, { banner: "" });
        toast.error("Photo supprimée");
      } catch (error) {
        toast.error(error.message);
      }
    });
  };

  async function uploadImageCategorie1(e) {
    setLoaderCategorie1(true);

    const imageFile = e.target.files[0];

    const storageRef = ref(
      storage,
      `ImagesCustom/${Date.now()}-${imageFile.name}`
    );

    const image = await resizeFile2(imageFile);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        toast.error(error);
        setTimeout(() => {
          setLoaderCategorie1(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setImageAssetCategorie1(downloadURL);
          setLoaderCategorie1(false);
          try {
            const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
            await updateDoc(collectionRef, { categorie1: downloadURL });
            toast.success("Nouvelle photo: Catégorie 1 ");
          } catch (error) {
            toast.error(error.message);
          }
        });
      }
    );
  }
  const deleteImageCategorie1 = () => {
    const deleteRef = ref(storage, imageAssetCategorie1);
    deleteObject(deleteRef).then(async () => {
      setImageAssetCategorie1(null);
      setLoaderCategorie1(false);
      try {
        const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
        await updateDoc(collectionRef, { categorie1: "" });
        toast.error("Photo supprimée");
      } catch (error) {
        toast.error(error.message);
      }
    });
  };

  async function uploadImageCategorie2(e) {
    setLoaderCategorie2(true);

    const imageFile = e.target.files[0];

    const storageRef = ref(
      storage,
      `ImagesCustom/${Date.now()}-${imageFile.name}`
    );

    const image = await resizeFile2(imageFile);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        toast.error(error);
        setTimeout(() => {
          setLoaderCategorie2(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setImageAssetCategorie2(downloadURL);
          setLoaderCategorie2(false);
          try {
            const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
            await updateDoc(collectionRef, { categorie2: downloadURL });
            toast.success("Nouvelle photo : Catérorie 2");
          } catch (error) {
            toast.error(error.message);
          }
        });
      }
    );
  }
  const deleteImageCategorie2 = () => {
    const deleteRef = ref(storage, imageAssetCategorie2);
    deleteObject(deleteRef).then(async () => {
      setImageAssetCategorie2(null);
      setLoaderCategorie2(false);
      try {
        const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
        await updateDoc(collectionRef, { categorie2: "" });
        toast.error("Photo supprimée");
      } catch (error) {
        toast.error(error.message);
      }
    });
  };

  async function uploadImageCategorie3(e) {
    setLoaderCategorie3(true);

    const imageFile = e.target.files[0];

    const storageRef = ref(
      storage,
      `ImagesCustom/${Date.now()}-${imageFile.name}`
    );

    const image = await resizeFile2(imageFile);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        toast.error(error);
        setTimeout(() => {
          setLoaderCategorie3(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setImageAssetCategorie3(downloadURL);
          setLoaderCategorie3(false);
          try {
            const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
            await updateDoc(collectionRef, { categorie3: downloadURL });
            toast.success("Nouvelle photo : Catégorie 3");
          } catch (error) {
            toast.error(error.message);
          }
        });
      }
    );
  }
  const deleteImageCategorie3 = () => {
    const deleteRef = ref(storage, imageAssetCategorie3);
    deleteObject(deleteRef).then(async () => {
      setImageAssetCategorie3(null);
      setLoaderCategorie3(false);
      try {
        const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
        await updateDoc(collectionRef, { categorie3: "" });
        toast.error("Photo Supprimé");
      } catch (error) {
        toast.error(error.message);
      }
    });
  };

  function uploadImageCategorie4(e) {
    setLoaderCategorie4(true);

    const imageFile = e.target.files[0];
    const storageRef = ref(
      storage,
      `ImagesCustom/${Date.now()}-${imageFile.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        toast.error(error);
        setTimeout(() => {
          setLoaderCategorie4(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setImageAsseCategorie4(downloadURL);
          setLoaderCategorie4(false);
          try {
            const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
            await updateDoc(collectionRef, { categorie4: downloadURL });
            toast.success("Nouvelle photo: Catégorie 4");
          } catch (error) {
            toast.error(error.message);
          }
        });
      }
    );
  }
  const deleteImageCategorie4 = () => {
    const deleteRef = ref(storage, imageAssetCategorie4);
    deleteObject(deleteRef).then(async () => {
      setImageAsseCategorie4(null);
      setLoaderCategorie4(false);
      try {
        const collectionRef = doc(db, "customs", "KcbqY75Un2lg3Yms5ei8");
        await updateDoc(collectionRef, { categorie4: "" });
        toast.error("Photo Supprimée");
      } catch (error) {
        toast.error(error.message);
      }
    });
  };

  return (
    <div className="h-full w-full flex items-center justify-center  ">
      {isLoading ? (
        <div className="flex items-center h-full w-full justify-center">
          <Lottie animationData={Aloading} loop={true} className="w-[200px]" />
        </div>
      ) : (
        Object.keys(allImages).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-2 md:gap-10  p-4 ">
            {/* ONE BANNER */}
            <div>
              <p className="text-center my-1 font-medium uppercase text-[#0fa3b1] ">
                Banner
              </p>
              <label htmlFor="banner" className="">
                {!imageAssetBanner ? (
                  <>
                    <div className="cursor-pointer bg-[#0fa3b1] text-white rounded-2xl  flex items-center justify-center flex-col  h-[180px] w-[180px] md:h-[220px] md:w-[220px] mx-auto mb-5">
                      {loaderBanner ? (
                        <SimpleLoader />
                      ) : (
                        <>
                          <BsFillCloudUploadFill className="text-[40px]" />
                          <p className="mt-2 text-[14px] font-medium">
                            Sélectionner une photo
                          </p>
                          <p className="font-semibold">BANNER</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="banner"
                      className="hidden"
                      onChange={uploadImageBanner}
                    />
                  </>
                ) : (
                  <div className=" relative w-fit mx-auto ">
                    <img
                      className="h-[180px] w-[180px] md:h-[220px] md:w-[220px] border border-[#0fa3b1] overflow-hidden object-cover mx-auto mb-5 rounded-md"
                      src={imageAssetBanner}
                      alt=""
                    />
                    <div
                      className="bg-red-500 text-white p-2 w-fit rounded-full absolute right-4 bottom-4 cursor-pointer hover:bg-white hover:text-red-500 transition-all duration-500"
                      onClick={() => deleteImageBanner()}
                    >
                      <MdDelete className="text-[24px]" />
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* TWO CATEGORIE 1 */}
            <div>
              <p className="text-center my-1 font-medium uppercase text-[#b5e2fa] ">
                catégorie: Granulat{" "}
              </p>
              <label htmlFor="categorieOne" className="">
                {!imageAssetCategorie1 ? (
                  <>
                    <div className="   cursor-pointer bg-[#b5e2fa] rounded-2xl text-white flex items-center justify-center flex-col  h-[180px] w-[180px] md:h-[220px] md:w-[220px] mx-auto mb-5">
                      {loaderCategorie1 ? (
                        <SimpleLoader />
                      ) : (
                        <>
                          <BsFillCloudUploadFill className="text-[40px]" />
                          <p className="mt-2 text-[14px] font-medium">
                            Sélectionner une photo
                          </p>
                          <p className="font-semibold uppercase">
                            catégorie: Granulat
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="categorieOne"
                      className="hidden"
                      onChange={uploadImageCategorie1}
                    />
                  </>
                ) : (
                  <div className=" relative w-fit mx-auto ">
                    <img
                      className="h-[180px] w-[180px] md:h-[220px] md:w-[220px] border border-[#b5e2fa]  overflow-hidden object-cover mx-auto mb-5 rounded-md"
                      src={imageAssetCategorie1}
                      alt=""
                    />
                    <div
                      className="bg-red-500 text-white p-2 w-fit rounded-full absolute right-4 bottom-4 cursor-pointer hover:bg-white hover:text-red-500 transition-all duration-500"
                      onClick={() => deleteImageCategorie1()}
                    >
                      <MdDelete className="text-[24px]" />
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* THREE CATEGORIE 2 */}
            <div>
              <p className="text-center my-1 font-medium uppercase text-[#dfdbd3] ">
                catégorie: Acier
              </p>
              <label htmlFor="categorieTwo" className="">
                {!imageAssetCategorie2 ? (
                  <>
                    <div className=" cursor-pointer bg-[#dfdbd3] rounded-2xl text-white  flex items-center justify-center flex-col h-[180px] w-[180px] md:h-[220px] md:w-[220px] mx-auto mb-5">
                      {loaderCategorie2 ? (
                        <SimpleLoader />
                      ) : (
                        <>
                          <BsFillCloudUploadFill className="text-[40px]" />
                          <p className="mt-2 text-[14px] font-medium">
                            Sélectionner une photo
                          </p>
                          <p className="font-semibold uppercase">
                            catégorie: Acier
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="categorieTwo"
                      className="hidden"
                      onChange={uploadImageCategorie2}
                    />
                  </>
                ) : (
                  <div className=" relative w-fit mx-auto ">
                    <img
                      className="h-[180px] w-[180px] md:h-[220px] md:w-[220px] border border-[#dfdbd3] overflow-hidden object-cover mx-auto mb-5 rounded-md"
                      src={imageAssetCategorie2}
                      alt=""
                    />
                    <div
                      className="bg-red-500 text-white p-2 w-fit rounded-full absolute right-4 bottom-4 cursor-pointer hover:bg-white hover:text-red-500 transition-all duration-500"
                      onClick={() => deleteImageCategorie2()}
                    >
                      <MdDelete className="text-[24px]" />
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* FOUR CATEGORIE 3 */}
            <div>
              <p className="text-center my-1 font-medium uppercase text-[#eddea4] ">
                catégorie: Boiserie
              </p>
              <label htmlFor="categorieThree" className="">
                {!imageAssetCategorie3 ? (
                  <>
                    <div className="   cursor-pointer bg-[#eddea4] rounded-2xl text-white  flex items-center justify-center flex-col  h-[180px] w-[180px] md:h-[220px] md:w-[220px] mx-auto mb-5">
                      {loaderCategorie3 ? (
                        <SimpleLoader />
                      ) : (
                        <>
                          <BsFillCloudUploadFill className="text-[40px]" />
                          <p className="mt-2 text-[14px] font-medium">
                            Sélectionner une photo
                          </p>
                          <p className="font-semibold uppercase">
                            catégorie: Boiserie
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="categorieThree"
                      className="hidden"
                      onChange={uploadImageCategorie3}
                    />
                  </>
                ) : (
                  <div className=" relative w-fit mx-auto ">
                    <img
                      className="h-[180px] w-[180px] md:h-[220px] md:w-[220px] border border-[#eddea4]  overflow-hidden object-cover mx-auto mb-5 rounded-md"
                      src={imageAssetCategorie3}
                      alt=""
                    />
                    <div
                      className="bg-red-500 text-white p-2 w-fit rounded-full absolute right-4 bottom-4 cursor-pointer hover:bg-white hover:text-red-500 transition-all duration-500"
                      onClick={() => deleteImageCategorie3()}
                    >
                      <MdDelete className="text-[24px]" />
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* FIVE CATEGORIE 4 */}
            <div>
              <p className="text-center my-1 font-medium uppercase text-[#f7a072] ">
                catégorie: Agglos
              </p>
              <label htmlFor="categorieFour" className="">
                {!imageAssetCategorie4 ? (
                  <>
                    <div className="   cursor-pointer bg-[#f7a072] rounded-2xl text-white  flex items-center justify-center flex-col  h-[180px] w-[180px] md:h-[220px] md:w-[220px] mx-auto mb-5">
                      {loaderCategorie4 ? (
                        <SimpleLoader />
                      ) : (
                        <>
                          <BsFillCloudUploadFill className="text-[40px]" />
                          <p className="mt-2 text-[14px] font-medium">
                            Sélectionner une photo
                          </p>
                          <p className="font-semibold uppercase">
                            {" "}
                            catégorie: Agglos
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="categorieFour"
                      className="hidden"
                      onChange={uploadImageCategorie4}
                    />
                  </>
                ) : (
                  <div className=" relative w-fit mx-auto ">
                    <img
                      className="h-[180px] w-[180px] md:h-[220px] md:w-[220px] border border-[#f7a072] overflow-hidden object-cover mx-auto mb-5 rounded-md"
                      src={imageAssetCategorie4}
                      alt=""
                    />
                    <div
                      className="bg-red-500 text-white p-2 w-fit rounded-full absolute right-4 bottom-4 cursor-pointer hover:bg-white hover:text-red-500 transition-all duration-500"
                      onClick={() => deleteImageCategorie4()}
                    >
                      <MdDelete className="text-[24px]" />
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Custom;
