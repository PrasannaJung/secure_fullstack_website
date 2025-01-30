"use client";
import React, { useEffect, useState } from "react";
import {
  Star,
  Clock,
  Banknote,
  Tag,
  CheckCircle,
  MessageSquare,
  Send,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import Image from "next/image";
import { getServiceById } from "@/api/services";
import { createReview, getReviewsForService } from "@/api/reviews";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className='flex gap-1'>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <Star
            key={index}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              (hover || rating) >= ratingValue
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onRatingChange(ratingValue)}
          />
        );
      })}
    </div>
  );
};

const SingleServiceComponent = ({ id }) => {
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await getServiceById(id);
        console.log("THE DATA IS ", response);

        setService(response.data.service);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to fetch service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error("Please add a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please add a review comment");
      return;
    }

    try {
      setSubmitting(true);
      const response = await createReview(rating, reviewText, id);
      console.log("Review response:", response); // Add this log

      // Only proceed if we have a successful response
      const newReview = {
        rating: rating,
        review: reviewText,
        createdAt: new Date().toISOString(),
        user: {
          username: JSON.parse(localStorage.getItem("user")).username,
          image: JSON.parse(localStorage.getItem("user")).image,
        },
        _id: response.data._id,
      };

      setReviews((prevReviews) => [newReview, ...prevReviews]);
      setReviewText("");
      setRating(0);
      toast.success("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !service) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Main Service Section */}
      <div className='grid md:grid-cols-2 gap-8 mb-12'>
        {/* Left side - Image */}
        <div className='relative rounded-xl overflow-hidden h-96'>
          <Image
            src={"http://localhost:5000/" + service.image}
            fill
            style={{
              objectFit: "cover",
            }}
            alt={"Service Image"}
            className='object-cover w-full h-full'
          />
          <div className='absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg'>
            <div className='flex items-center gap-1'>
              <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />
              <span className='font-medium'>4.3</span>
            </div>
          </div>
        </div>

        {/* Right side - Details */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-semibold mb-4'>{service.name}</h1>
            <span className='inline-block px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium'>
              {service.category}
            </span>
          </div>

          <p className='text-gray-600 mt-4'>{service.description}</p>

          <div className='space-y-4'>
            <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'>
              <Banknote className='w-5 h-5 text-gray-600' />
              <div>
                <p className='text-sm text-gray-500'>Price</p>
                <p className='font-medium'>Rs. {service.price}</p>
              </div>
            </div>

            <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'>
              <Clock className='w-5 h-5 text-gray-600' />
              <div>
                <p className='text-sm text-gray-500'>Expected Arrival Time</p>
                <p className='font-medium'>{service.arrivalTime}</p>
              </div>
            </div>

            <div className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'>
              <Tag className='w-5 h-5 text-gray-600' />
              <div>
                <p className='text-sm text-gray-500'>Provider</p>
                <p className='font-medium'>{service.provider.username}</p>
              </div>
            </div>
          </div>

          <button className='w-full bg-primary-default text-white py-3 rounded-lg hover:bg-blue-500 transition-colors mt-6'>
            <Link href={`/services/book/${service._id}`}>Book Service</Link>
          </button>
        </div>
      </div>

      {/* Service Inclusions */}
      <Card className='p-6 mb-12'>
        <h2 className='text-2xl font-semibold mb-6'>Service Inclusions</h2>
        <div className='grid md:grid-cols-2 gap-4'>
          {service.servicesIncluded.map((item, index) => (
            <div key={index} className='flex items-center gap-2'>
              <CheckCircle className='w-5 h-5 text-green-500' />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Review Section */}
      <Card className='p-6 mb-12'>
        <h2 className='text-2xl font-semibold mb-6'>Add Your Review</h2>
        <div className='space-y-4'>
          <div>
            <p className='text-sm text-gray-600 mb-2'>Rate this service</p>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
          <div className='flex gap-4'>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className='flex-1 p-3 border rounded-lg resize-none h-32'
              placeholder='Share your experience...'
            />
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className='self-end bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Send className='w-4 h-4' />
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </Card>

      {/* Reviews Section */}
      <div>
        <h2 className='text-2xl font-semibold mb-6'>Customer Reviews</h2>
        <div className='grid gap-6'>
          {reviews.length === 0 ? (
            <Card className='p-6'>
              <p className='text-center text-gray-500'>No reviews added yet</p>
            </Card>
          ) : (
            reviews.map((review, index) => (
              <Card key={index} className='p-6'>
                <div className='flex items-center gap-4 mb-4'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage
                      src={
                        review.user.image
                          ? `http://localhost:5000/${review.user.image}`
                          : ""
                      }
                      alt={review.user.username}
                    />
                    <AvatarFallback>
                      {review.user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{review.user.username}</p>
                    <p className='text-sm text-gray-500'>
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                  <div className='ml-auto flex gap-1'>
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className='w-4 h-4 text-yellow-500 fill-yellow-500'
                      />
                    ))}
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <MessageSquare className='w-5 h-5 text-gray-400 mt-1' />
                  <p className='text-gray-600'>{review.review}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleServiceComponent;
