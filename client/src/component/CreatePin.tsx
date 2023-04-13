import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { client } from "../utils/client";
import useUserStore from "../store/user";
import { categories } from "../utils/categories";
import { SanityImageAssetDocument } from "@sanity/client";
import { HOME } from "../utils/path";
const CreatePin: React.FC = () => {
  const { user } = useUserStore();
  const [title, setTitle] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<boolean>(false);
  const [imageAsset, setImageAsset] = useState<SanityImageAssetDocument | null>(null);
  const [category, setCategory] = useState<string>("");
  const [wrongImageType, setWrongImageType] = useState<boolean>(false);
  const navigate = useNavigate();

  const onUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];
    const types = ["image/png", "image/jpg", "image/jpeg", "image/svg", "image/gif", "image/tiff"];
    if (types.includes(selectedFile.type)) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload("image", selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((doc) => {
          setImageAsset(doc);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Image upload error", error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const onSavePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
        userId: user?.sub,
        postedBy: {
          _type: "postedBy",
          _ref: user?.sub,
        },
        category,
      };

      client.create(doc).then(() => navigate(HOME));
    } else {
      const scrollContainer = document.querySelector("#container-scroll");
      const scroll = scrollContainer?.scrollTop || 0;

      scrollContainer?.scrollBy(0, -scroll);
      setFields(true);
      setTimeout(() => setFields(false), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">Please fill in all the fields</p>
      )}
      <div className="flex flex-col bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>Wroing image type </p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">Use high-quality JPG, SVG, PNG, GIF or TIFF less than 20 MB</p>
                </div>
                <input type="file" name="upload-image" onChange={onUploadImage} className="w-0 h-0" />
              </label>
            ) : (
              <div className="relative h-full">
                <img src={imageAsset?.url} alt="upladed image" className="h-full w-full" />
                <button
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Ad your title here"
            className="outline-none text-base border-b-2 border-gray-200 p-2"
          />
          <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
            <img src={user?.picture} alt="user avatar" className="w-10 h-10 rounded-full" />
            <p className="font-bold">{user?.name}</p>
          </div>
          <input
            type="text"
            value={about}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAbout(e.target.value)}
            placeholder="What is your about"
            className="outline-none text-base border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={destination}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">Choouse Pin Category</p>
              <select
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
              >
                <option value="other" className="bg-white">
                  Select category
                </option>
                {categories.map((category) => (
                  <option
                    key={category.name}
                    value={category.name}
                    className="text-base border-0 outline-none bg-white text-black"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                disabled={loading}
                onClick={onSavePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                {loading ? "Saved..." : "Save pin"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
