import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Pannellum } from 'react-pannellum';
import SplitPane from 'react-split-pane';
import { Upload, Tag, Save } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  imageUrl: string;
}

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTours, setSelectedTours] = useState<Tour[]>([]);
  const [comments, setComments] = useState<{
    [key: string]: { pitch: number; yaw: number; text: string }[];
  }>({});
  const [newComment, setNewComment] = useState({
    tourId: '',
    pitch: 0,
    yaw: 0,
    text: '',
  });

  useEffect(() => {
    if (id && user) {
      const projectRef = firestore.collection('projects').doc(id);
      projectRef.get().then((doc) => {
        if (doc.exists) {
          setProjectName(doc.data()?.name);
        }
      });

      const unsubscribe = projectRef
        .collection('tours')
        .onSnapshot((snapshot) => {
          const tourData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Tour[];
          setTours(tourData);
        });

      return () => unsubscribe();
    }
  }, [id, user]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && id && user) {
      const storageRef = storage.ref(`tours/${user.uid}/${id}/${file.name}`);
      try {
        await storageRef.put(file);
        const imageUrl = await storageRef.getDownloadURL();
        await firestore.collection('projects').doc(id).collection('tours').add({
          name: file.name,
          imageUrl,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleTourSelection = (tour: Tour) => {
    if (selectedTours.length < 2) {
      setSelectedTours([...selectedTours, tour]);
    } else {
      setSelectedTours([selectedTours[1], tour]);
    }
  };

  const addComment = (tourId: string, event: any) => {
    const { pitch, yaw } = event;
    setNewComment({ tourId, pitch, yaw, text: '' });
  };

  const saveComment = () => {
    if (newComment.text) {
      setComments({
        ...comments,
        [newComment.tourId]: [
          ...(comments[newComment.tourId] || []),
          {
            pitch: newComment.pitch,
            yaw: newComment.yaw,
            text: newComment.text,
          },
        ],
      });
      setNewComment({ tourId: '', pitch: 0, yaw: 0, text: '' });
    }
  };

  const pannellumConfig = {
    autoLoad: true,
    showControls: false,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{projectName}</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload 360° Image</h2>
        <label className="flex items-center justify-center w-64 h-12 px-4 py-2 bg-white text-blue-600 rounded-lg shadow-lg tracking-wide border border-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white">
          <Upload size={24} className="mr-2" />
          <span>Choose a file</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*"
          />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className={`bg-white p-4 rounded-lg shadow-md cursor-pointer ${
              selectedTours.includes(tour) ? 'border-2 border-blue-600' : ''
            }`}
            onClick={() => handleTourSelection(tour)}
          >
            <img
              src={tour.imageUrl}
              alt={tour.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <p className="font-semibold">{tour.name}</p>
          </div>
        ))}
      </div>
      {selectedTours.length > 0 && (
        <SplitPane split="vertical" minSize={50} defaultSize="50%">
          {selectedTours.map((tour) => (
            <div key={tour.id} className="h-[500px]">
              <Pannellum
                width="100%"
                height="100%"
                image={tour.imageUrl}
                pitch={10}
                yaw={180}
                hfov={110}
                {...pannellumConfig}
                onMousedown={(event: any) => addComment(tour.id, event)}
              >
                {comments[tour.id]?.map((comment, index) => (
                  <Pannellum.Hotspot
                    key={index}
                    type="custom"
                    pitch={comment.pitch}
                    yaw={comment.yaw}
                    handleClick={() => alert(comment.text)}
                    name={`comment-${index}`}
                  />
                ))}
              </Pannellum>
            </div>
          ))}
        </SplitPane>
      )}
      {newComment.tourId && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <textarea
            value={newComment.text}
            onChange={(e) =>
              setNewComment({ ...newComment, text: e.target.value })
            }
            placeholder="Enter your comment"
            className="w-full h-24 p-2 border border-gray-300 rounded-md mb-2"
          />
          <button
            onClick={saveComment}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Save size={16} className="inline-block mr-2" />
            Save Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
