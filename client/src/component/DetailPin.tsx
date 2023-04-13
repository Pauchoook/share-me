import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Spinner from "./Spinner";
import { client, urlFor } from "../utils/client";
import usePinStore from "../store/pin";
import { USER_PROFILE } from "../utils/path";
import useUserStore from "../store/user";
import MasonryLayout from "./MasonryLayout";

const DetailPin: React.FC = () => {
  const { user } = useUserStore();
  const { currentPin, similarCurrentPin, getPin, loading } = usePinStore();
  const [comment, setComment] = useState<string>("");
  const [addingComment, setAddingComment] = useState<boolean>(false);
  const { pinId } = useParams();

  useEffect(() => {
    getPin(pinId || "");
  }, [pinId]);

  const addComment = () => {
    if (comment && pinId) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          { comment, _key: uuidv4(), postedBy: { _type: "postedBy", _ref: user?.sub } },
        ])
        .commit()
        .then(() => {
          getPin(pinId || "");
          setComment("");
          setAddingComment(false);
        });
    }
  };

  if (loading) {
    return <Spinner message="Loading pin..." />;
  }

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto mt-3 bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={currentPin?.image && urlFor(currentPin.image.asset.url).url()}
            alt="Image pin"
            className="rounded-lg"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${currentPin?.image.asset.url}?dl=`}
                download
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={currentPin?.destination} target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100">
              resource
            </a>
          </div>
          <div>
            <p className="mt-5 mb-2 text-base text-gray-400">
              <span className="font-bold text-black">Category:</span> {currentPin?.category}
            </p>
            <h1 className="text-4xl font-bold break-words mt-3">{currentPin?.title}</h1>
            <p className="mt-3">{currentPin?.about}</p>
          </div>
          <Link
            to={USER_PROFILE + "/" + currentPin?.postedBy?._id}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg "
          >
            <img className="w-8 h-8 rounded-full object-cover" src={currentPin?.postedBy?.picture} alt="user profile" />
            <p className="font-semibold capitalize">{currentPin?.postedBy?.username}</p>
          </Link>
          <h2 className="text-2xl mt-5">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {currentPin?.comments?.map((comment, index) => (
              <div key={index} className="flex mt-5 gap-2 bg-white rounded-lg">
                <img
                  src={comment.postedBy.picture}
                  alt="user avatar"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy?.username}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col mt-6 gap-3">
            <input
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-200"
            />
            <button
              disabled={addingComment}
              onClick={addComment}
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
            >
              {addingComment ? "Posting the comment..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      {similarCurrentPin.length ? (
        <>
          <h2 className="text-center font-bold text-2x mt-8 mb-4">More like this</h2>
          <MasonryLayout pins={similarCurrentPin} />
        </>
      ) : (
        <h2 className="font-bold text-center text-xl py-7">Similar pins are missing :c</h2>
      )}
    </>
  );
};

export default DetailPin;
