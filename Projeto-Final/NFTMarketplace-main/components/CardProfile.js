<<<<<<< HEAD
import React, { useContext } from "react";
import { LoginContext } from "../context/LoginContext";
export const CardProfile = ({ data, size }) => {
  const {
    users,
    getUsers,
    userInfo,
    walletId,
    removeFavorite,
    addFavorite,
    favoritedList,
  } = useContext(LoginContext);
  console.log(data.tokenId, favoritedList);
  return (
    <>
      <div
        className="max-w-sm rounded overflow-hidden shadow-lg border-purple-700 	rounded mb-6 flex-shrink-0"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
        }}
      >
        <div
          style={{
            marginRight: "10px",
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          {favoritedList && favoritedList.includes(data.itemId) ? (
            <img
              style={{
                position: "absolute",
                marginTop: "10px",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
              onClick={() => {
                removeFavorite(data, "cardProfile");
              }}
              src={"/heart.png"}
            />
          ) : (
            <img
              style={{
                position: "absolute",
                marginTop: "10px",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
              onClick={() => {
                addFavorite(data, "cardProfile");
              }}
              src={"/heart2.png"}
            />
          )}
        </div>

        <img
          className="w-full"
          src={data.image}
          style={{
            height: size === "userFavorite" ? "300px" : "450px",
            width: size === "userFavorite" ? "300px" : "",
          }}
          alt="Sunset in the mountains"
        />
        <div className="px-6 py-4">
          <div className=" text-white font-bold text-xl mb-2"> {data.name}</div>
          <p className="text-white text-base overflow-ellipsis overflow-hidden">
            {data.description}
          </p>
        </div>

        <div className="px-6 py-4">
          <div className=" text-white font-bold text-xl mb-2"> Price</div>
          <p className="font-bold text-base" style={{ color: "#984dc4" }}>
            {data.price} MATIC
          </p>
        </div>
=======
import React from "react";

export const CardProfile = ({ data }) => {
  return (
    <div class="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        class="w-full"
        src="/img/card-top.jpg"
        alt="Sunset in the mountains"
      />
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
        <p class="text-gray-700 text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
          quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
          nihil.
        </p>
      </div>
      <div class="px-6 pt-4 pb-2">
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #photography
        </span>
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #travel
        </span>
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #winter
        </span>
>>>>>>> parent of ed5f905... Update CardProfile.js, UserProfile.js, and 17 more files...
      </div>
    </div>
  );
};
