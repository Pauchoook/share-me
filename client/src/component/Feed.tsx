import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import usePinStore from "../store/pin";

const Feed: React.FC = () => {
  const { loading, pins, getPins, searchValue, slicePins, maxPins } = usePinStore();
  const { categoryId } = useParams();

  useEffect(() => {
    getPins(categoryId || "", searchValue);
  }, [categoryId, searchValue]);

  const handlerMore = () => {
    slicePins(30, categoryId || "");
  };

  if (loading && categoryId) {
    return <Spinner message="We are adding new ideas to your feed!" />;
  }

  return (
    <div className="pt-5">
      {!pins.length ? <h2 className="font-bold text-center">Pins absent :c</h2> : <MasonryLayout pins={pins} />}
      {loading && <Spinner message="We are adding new ideas to your feed!" />}
      {maxPins <= pins.length && !loading && (
        <button
          disabled={loading}
          onClick={handlerMore}
          className="w-full mt-2 text-white font-bold cursor-pointer bg-red-500 py-2 px-3 rounded-lg"
        >
          More pins
        </button>
      )}
    </div>
  );
};

export default Feed;
