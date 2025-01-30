"use client";
import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, X, Pen } from "lucide-react";
import { getMe, updateUser, uploadImage } from "@/api/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const { logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if (response && response.data) {
          setUser(response.data);
          setFormData({
            username: response.data.username || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
          });
          setImagePreview(response.data.profilePicture);
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload image
      try {
        const formData = new FormData();
        formData.append("profileImage", file);
        const response = await uploadImage(formData);
        if (response.data.success) {
          setUser((prev) => ({
            ...prev,
            image: response.data.data,
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        // Revert preview on error
        setImagePreview(user.profilePicture);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Call update user API here
      const response = await updateUser(formData); // You'll need to implement this API call
      if (response.data) {
        setUser({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          image: user.image,
        });
        setIsEditing(false);
        setShowAlert(true);
        // Hide alert after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='flex space-x-2'>
          <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce'></div>
          <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150'></div>
          <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-300'></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-gray-500'>Failed to load user profile.</p>
      </div>
    );
  }

  const AvatarWithUpload = () => (
    <div className='relative'>
      <Avatar className='w-16 h-16'>
        <AvatarImage src={imagePreview || "/profile.jpg"} alt='Profile' />
        <AvatarFallback>
          {formData.username ? formData.username[0].toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>
      {isEditing && (
        <button
          onClick={handleImageClick}
          className='absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100'
        >
          <Pen size={14} />
        </button>
      )}
      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        accept='image/*'
        onChange={handleImageChange}
      />
    </div>
  );

  return (
    <div className='flex h-screen'>
      {showAlert && (
        <div className='fixed top-4 right-4 z-50'>
          <Alert className='bg-green-50 border-green-200'>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your profile has been updated successfully.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className='w-64 bg-gray-100 p-6'>
        <ul className='space-y-4'>
          <li>
            <Link href='/profile' className='font-semibold text-black'>
              Profile
            </Link>
          </li>
          <li>
            <Link href='/my/orders' className=''>
              Orders
            </Link>
          </li>
          <li>
            <Link
              href='/my/payments'
              className='text-gray-600 hover:text-black'
            >
              Payment History
            </Link>
          </li>
          <li>
            <Link href='/my/reviews' className='text-gray-600 hover:text-black'>
              Reviews
            </Link>
          </li>
          <li>
            <div
              onClick={() => logout()}
              className='text-gray-600 hover:text-black flex items-center space-x-2 hover:cursor-pointer'
            >
              <LogOut size={16} />
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>
      <div className='flex-1 p-8 max-w-5xl mx-auto'>
        {isEditing ? (
          <>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold'>Edit Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className='text-gray-500 hover:text-black'
              >
                <X size={24} />
              </button>
            </div>
            <div className='flex items-center space-x-4 mb-6'>
              <AvatarWithUpload />
              <div>
                <p className='text-gray-500'>
                  {formData.email || "No email available"}
                </p>
              </div>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-500'>Name</span>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  className='border rounded-lg p-2 w-1/2'
                />
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-500'>Email account</span>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='border rounded-lg p-2 w-1/2'
                />
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-500'>Mobile number</span>
                <input
                  type='text'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  className='border rounded-lg p-2 w-1/2 bg-gray-100'
                  disabled
                />
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='mt-6 bg-primary-default'>
                  Save Changes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to save these changes to your profile?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave}>
                    Save Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <>
            <div className='flex justify-between items-center'>
              <div className='flex items-center space-x-4'>
                <AvatarWithUpload />
                <div>
                  <h2 className='text-xl font-semibold'>
                    {user.username || "Unknown User"}
                  </h2>
                  <p className='text-gray-500'>
                    {user.email || "No email available"}
                  </p>
                </div>
              </div>
              <Button variant='outline' onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </div>
            <div className='mt-6 border-t pt-4'>
              <div className='py-2 flex justify-between'>
                <span className='text-gray-500'>Name</span>
                <span>{user.username || "Not provided"}</span>
              </div>
              <div className='py-2 flex justify-between'>
                <span className='text-gray-500'>Email account</span>
                <span>{user.email || "Not provided"}</span>
              </div>
              <div className='py-2 flex justify-between'>
                <span className='text-gray-500'>Mobile number</span>
                <span>{user.phone || "Not provided"}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
