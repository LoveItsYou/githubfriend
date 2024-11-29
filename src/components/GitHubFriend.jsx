import { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import GitHubLogo from "../assets/github.png";
import loadingGif from "../assets/loading.gif";

const initialState = {
  isClicked: false,
  isTyping: false,
  inputText: "",
  shouldFetch: false,
  users: null,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLICKED": {
      return {
        ...state,
        isClicked: true,
        isTyping: false,
        shouldFetch: true,
        loading: true,
      };
    }
    case "TYPING": {
      return {
        ...state,
        isClicked: false,
        isTyping: true,
        shouldFetch: false,
        loading: true,
        users: null,
        inputText: action.value,
      };
    }
    case "FETCH_INIT": {
      return {
        ...state,
        loading: true,
        shouldFetch: true,
      };
    }
    case "USER_FOUNDED": {
      return {
        ...state,
        users: action.value,
      };
    }
    case "RESET": {
      return {
        ...state,
        loading: false,
        isTyping: false,
        isClicked: false,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

const GitHubFriend = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isClicked, isTyping, inputText, shouldFetch, users, loading } = state;

  useEffect(() => {
    const fetchHandler = async () => {
      const nameSegment = (name) => {
        let temp = "";
        return Array.from(name)
          .map((value) => {
            temp += value;
            if (temp.length > 0) {
              return temp;
            }
          })
          .reverse()
          .filter((v) => v)
          .slice(0, 4);
      };
      const totalFetch = nameSegment(
        inputText.toLowerCase().split(" ").join("")
      );

      const storeUser = [];

      if (totalFetch.length > 0) {
        totalFetch.forEach((name, index, arrr) => {
          setTimeout(async () => {
            try {
              const response = await fetch(
                `https://api.github.com/users/${name}`
              );
              if (response.status === 200) {
                const user = await response.json();
                if (user) {
                  storeUser.push(user);
                }
                if (index === totalFetch.length - 1) {
                  dispatch({
                    type: "USER_FOUNDED",
                    value: storeUser,
                  });
                  dispatch({
                    type: "RESET",
                  });
                }
              }
            } catch (error) {
              console.log(error.message);
            }
          }, 500 * index);
        });
      }
    };

    if (shouldFetch || (isClicked && inputText !== "")) {
      fetchHandler();
    }

    // eslint-disable-next-line
  }, [shouldFetch, isClicked]);

  useEffect(() => {
    isTyping &&
      (() => {
        let delayId;
        clearTimeout(delayId);
        delayId = setTimeout(() => {
          dispatch({
            type: "FETCH_INIT",
          });
          dispatch({
            type: "RESET",
          });
        }, 3000);
      })();
  }, [isTyping]);

  useEffect(() => {
    inputText === "" &&
      (() => {
        const id = setTimeout(() => {
          dispatch({
            type: "RESET",
          });
          clearTimeout(id);
        }, 10);
      })();
  }, [inputText]);

  return (
    <div className="w-[600px] max-w-full min-h-[615px] rounded-lg outline outline-1 outline-gray-600 shadow-2xl shadow-gray-700 overflow-hidden">
      {/* Head */}
      <div className="bg-[rgba(var(--secondary),1)] flex flex-col sm:flex-row gap-y-3 justify-between items-center border-b pb-3 border-gray-600 p-3">
        <Link to="https://github.com/DevAbabil" target="_blank">
          <img src={GitHubLogo} className="size-[50px] bg-white rounded-full" />
        </Link>
        <div className="flex flex-col md:flex-row justify-center items-center gap-y-3 gap-x-2 p-3">
          {loading && <img src={loadingGif} className="size-[35px]" />}
          <input
            type="text"
            placeholder="Broken Angel"
            className="rounded-md text-[rgba(var(--primary))] font-semibold px-2 w-[300px] max-w-full  focus:outline-none border-2 border-transparent focus:border-2 focus:border-[rgba(var(--acent))]"
            value={inputText}
            onChange={(e) => {
              dispatch({
                type: "TYPING",
                value: e.target.value,
              });
            }}
          />
          <button
            className=" bg-[rgba(var(--acent),1)] font-bold py-1 px-4 rounded-md"
            disabled={inputText === "" && loading}
            onClick={() => {
              dispatch({
                type: "CLICKED",
              });
            }}
          >
            Search
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="px-2 py-2 overflow-y-auto flex flex-col gap-y-2">
        {!loading && users && users.length > 0
          ? users.map((user) => (
              <div
                className="bg-[rgba(var(--secondary),0.7)] p-3 flex justify-between items-center rounded-md"
                key={user.login}
              >
                <div className="flex gap-x-2 w-[76%]">
                  <img
                    src={user.avatar_url}
                    className="size-[100px] rounded-lg border"
                  />
                  <div>
                    <p className="font-bold text-xl">{user.login}</p>
                    <p className="text-gray-400">
                      <span className="font-bold text-gray-400">Followers</span>{" "}
                      : {user.followers}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-bold text-gray-400">Following</span>{" "}
                      : {user.following}
                    </p>
                    <p className="text-gray-400">
                      {user.bio
                        ? user.bio.slice(0, 40).toString() + " ..."
                        : "🙂"}
                    </p>
                  </div>
                </div>
                <Link
                  to={user.html_url}
                  target="_blank"
                  className="w-[120px] bg-[rgba(var(--acent-secondary),1)] font-bold py-1 px-4 rounded-md text-[rgba(var(--secondary),1)] text-center"
                >
                  See Details
                </Link>
              </div>
            ))
          : inputText !== "" &&
            users &&
            users.length === 0 &&
            !loading && (
              <div className="text-center text-red-500">No User Found</div>
            )}
      </div>
    </div>
  );
};

export default GitHubFriend;
