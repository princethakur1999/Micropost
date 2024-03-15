import { BiSolidLike } from "react-icons/bi";
import { FaCommentAlt } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useState } from "react";
import Comment from "./Comment";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from 'date-fns';



const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;


export default function UserPost({ post, poster, posterPic }) {



    const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
    const [postComments, setPostComments] = useState(post.comments);
    const userid = localStorage.getItem("userid");

    const addLikeToThisPost = async (postid) => {

        try {

            const response = await axios.post(`${BASE_URL}/like/${postid}/${userid}`);

            if (!response.data.success) {

                throw new Error(response.data.message || "Server error");
            }

            toast.success(response.data.message);

            setLikesCount((prevLikes) => prevLikes + (response.data.message === "Liked" ? 1 : -1));

        } catch (error) {

            console.error(error);

            toast.error(error.message || "An error occurred");
        }
    };

    const handlerComment = (e) => {

        setComment(e.target.value);
    }

    const addCommentToThisPost = async (e) => {

        e.preventDefault();

        try {

            if (!comment.trim()) {
                return;
            }

            const response = await axios.post(`${BASE_URL}/comment/${post._id}/${comment}/${userid}`);

            if (!response.data.success) {

                throw new Error(response.data.message || "Server error");
            }

            setComment('');

            console.log(response.data.comments);

            toast.success(response.data.message);

            setCommentsCount((prevComments) => prevComments + 1);

            setPostComments(response.data.comments);


        } catch (error) {

            console.error(error);

            toast.error(error.message || "An error occurred");
        }
    };

    return (

        <div className="w-[100%] h-[540px] flex flex-col justify-between gap-2 p-2 border rounded-md bg-4">

            <div className="w-[100%] h-[80%] flex flex-col justify-center items-center gap-4">

                <div className="w-[100%] h-auto flex justify-between items-center py-2 border-b">


                    <div className="w-max flex justify-between items-center gap-4">


                        <img className="h-[40px] w-[40px] rounded-full bg-white border" src={posterPic} alt="pr" />


                        <p className="text-white font-bold">
                            {poster}
                        </p>


                        <p className="text-white">
                            {
                                format(new Date(post.createdAt), 'dd/MM/yyyy')
                            }
                        </p>

                    </div>

                </div>



                <div className="h-[80%] w-[100%] flex justify-center items-center">
                    <img className="h-[100%] w-auto object-cover rounded-lg" src={post.image} alt="post" />
                </div>
            </div>


            <div className="w-[100%] flex justify-between py-2 border-t">
                <p className="text-white text-xl cursor-pointer">{likesCount}</p>
                <p className="text-white  text-xl cursor-pointer">{commentsCount}</p>
            </div>

            <div className="w-[100%] flex justify-between py-2">

                <p onClick={() => addLikeToThisPost(post._id)} className="text-3xl cursor-pointer text-white hover:scale-125 transition ease-in-out">
                    <BiSolidLike />
                </p>

                <p className="text-white  text-2xl cursor-pointer" onClick={() => setIsCommentBoxOpen(!isCommentBoxOpen)}>
                    <FaCommentAlt />
                </p>

            </div>


            {
                isCommentBoxOpen &&
                <div className="h-[100vh] w-[100vw] flex flex-col justify-start items-center pt-20 bg-white dark:bg-slate-900 fixed top-0 bottom-0 left-0 right-0 z-42">

                    <div className="w-[98%] sm:w-[50%] h-[75vh] flex flex-col justify-between px-2 rounded-md overflow-y-auto bg-4">

                        <div className="w-[100%] h-[80%]  flex flex-col justify-between items-center">

                            <div className="w-[100%] h-auto flex justify-between items-center py-2 border-b">

                                <div className="w-max flex justify-between items-center gap-4">

                                    <img className="h-[40px] w-[40px] rounded-full" src={posterPic} alt="profile" />

                                    <p className="text-white font-bold cursor-pointer">
                                        {poster}
                                    </p>

                                    <p className="text-white ">
                                        {
                                            format(new Date(post.createdAt), 'dd/MM/yyyy')
                                        }
                                    </p>

                                </div>


                                <p className="text-white text-2xl cursor-pointer" onClick={() => setIsCommentBoxOpen(!isCommentBoxOpen)}>
                                    <FaWindowClose />
                                </p>
                            </div>


                            <div className="h-[80%] w-[100%] flex justify-center items-center">
                                <img className="h-[100%] w-auto object-cover rounded-md" src={post.image} alt="post" />
                            </div>
                        </div>


                        <div className="w-[100%] flex justify-between border-b py-2 my-2">

                            <p className="text-white text-xl cursor-pointer">
                                {post.likes?.length}
                            </p>

                            <p className="text-white text-xl cursor-pointer">
                                {post.comments?.length}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {
                                postComments?.map((comment) => <Comment comment={comment} key={comment._id} />)
                            }
                        </div>

                    </div>

                    <form className="bg-3 w-[98%] sm:w-[50%] rounded-md fixed bottom-4 flex justify-between px-2 border">

                        <input
                            className="bg-3 w-[100%] p-2 focus-within:outline-none text-slate-600"
                            type="text"
                            placeholder="Type......"
                            value={comment}
                            onChange={handlerComment}
                            onKeyDown={(e) => e.key === 'Enter' && addCommentToThisPost(e)}

                        />

                        <button onClick={addCommentToThisPost} className="text-2xl text-blue-800">
                            <IoSend />
                        </button>
                    </form>
                </div>
            }
        </div>
    )
}
