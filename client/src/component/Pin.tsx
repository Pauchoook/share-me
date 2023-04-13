import React, { useState } from "react";
import { IPin } from "../type/pin";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../utils/client";
import { Link, useNavigate } from "react-router-dom";
import { DETAIL_PIN, USER_PROFILE } from "../utils/path";
import { MdDownloadForOffline } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import useUserStore from "../store/user";
import { AiTwotoneDelete } from "react-icons/ai";

interface PinProps {
  pin: IPin;
}

const Pin: React.FC<PinProps> = ({ pin }) => {
  const { user } = useUserStore();
  const [isPostHovered, setIsPostHovered] = useState<boolean>(false);
  const navigate = useNavigate();
  const alreadySaved = pin.save ? pin.save.find((item) => item.postedBy._id === user?.sub) : null;

  const onSavePin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!alreadySaved) {
      client
        .patch(pin?._id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const onDeletePin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    client.delete(pin?._id).then(() => window.location.reload());
  };

  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        onClick={() => navigate(DETAIL_PIN + "/" + pin?._id)}
        onMouseEnter={() => setIsPostHovered(true)}
        onMouseLeave={() => setIsPostHovered(false)}
      >
        <img src={urlFor(pin.image.asset.url).width(250).url()} alt="user post image" className="rounded-lg w-full" />
        {isPostHovered && (
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <a
                  href={`${pin.image.asset.url}?dl=`}
                  download
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button className="bg-red-500 text-white font-bold px-5 py-1 text-base rounded-3xl shadow-md outlined-none">
                  {pin.save?.length} Saved
                </button>
              ) : (
                <button
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
                  onClick={onSavePin}
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {pin.destination && (
                <a
                  href={pin.destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black fon-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill />
                  resource
                </a>
              )}
              {pin.postedBy?._id === user?.sub && (
                <button
                  onClick={onDeletePin}
                  className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outlined-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link to={USER_PROFILE + "/" + pin.postedBy?._id} className="flex gap-2 mt-2 items-center">
        <img className="w-8 h-8 rounded-full object-cover" src={pin?.postedBy?.picture} alt="user profile" />
        <p className="font-semibold capitalize">{pin.postedBy?.username}</p>
      </Link>
    </div>
  );
};

export default Pin;
