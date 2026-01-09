'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setActiveProfile, addProfile, updateProfile, deleteProfile } from '@/store/slices/userSlice';
import { AVATAR_COLORS } from '@/lib/constants';
import { getInitials, getRandomItem } from '@/lib/utils';
import type { UserProfile } from '@/types';

export default function ProfilesClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.user);
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  if (!isAuthenticated || !user) {
    router.push('/login');
    return null;
  }

  const handleSelectProfile = (profile: UserProfile) => {
    if (isManaging) {
      setEditingProfile(profile);
    } else {
      dispatch(setActiveProfile(profile.id));
      router.push('/');
    }
  };

  const handleAddProfile = () => {
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4 py-20">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl text-white font-medium mb-2">
          {isManaging ? 'Manage Profiles' : "Who's watching?"}
        </h1>
        
        {/* Profiles Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 my-8">
          {user.profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleSelectProfile(profile)}
              className="group cursor-pointer"
            >
              <div className="relative">
                <div
                  className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded flex items-center justify-center text-3xl md:text-4xl font-bold text-white border-2 border-transparent group-hover:border-white transition-all"
                  style={{ backgroundColor: profile.avatar }}
                >
                  {getInitials(profile.name)}
                </div>
                
                {/* Edit Overlay */}
                {isManaging && (
                  <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
                    <FiEdit2 size={32} className="text-white" />
                  </div>
                )}

                {/* Kids Badge */}
                {profile.isKids && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-netflix-red text-white text-xs font-medium rounded">
                    KIDS
                  </div>
                )}
              </div>
              <p className="mt-3 text-netflix-gray group-hover:text-white text-sm md:text-base transition-colors">
                {profile.name}
              </p>
            </motion.div>
          ))}

          {/* Add Profile Button */}
          {user.profiles.length < 5 && !isManaging && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: user.profiles.length * 0.1 }}
              onClick={handleAddProfile}
              className="group cursor-pointer"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded border-2 border-netflix-gray border-dashed flex items-center justify-center group-hover:border-white transition-all">
                <FiPlus size={48} className="text-netflix-gray group-hover:text-white transition-colors" />
              </div>
              <p className="mt-3 text-netflix-gray group-hover:text-white text-sm md:text-base transition-colors">
                Add Profile
              </p>
            </motion.div>
          )}
        </div>

        {/* Manage Profiles Button */}
        <button
          onClick={() => setIsManaging(!isManaging)}
          className={`px-8 py-2 border text-lg transition-colors ${
            isManaging
              ? 'bg-white text-black border-white hover:bg-netflix-red hover:border-netflix-red hover:text-white'
              : 'border-netflix-gray text-netflix-gray hover:border-white hover:text-white'
          }`}
        >
          {isManaging ? 'Done' : 'Manage Profiles'}
        </button>
      </div>

      {/* Add Profile Modal */}
      {showAddModal && (
        <AddProfileModal
          onClose={() => setShowAddModal(false)}
          onAdd={(profile) => {
            dispatch(addProfile(profile));
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Profile Modal */}
      {editingProfile && (
        <EditProfileModal
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSave={(profile) => {
            dispatch(updateProfile(profile));
            setEditingProfile(null);
          }}
          onDelete={(id) => {
            dispatch(deleteProfile(id));
            setEditingProfile(null);
          }}
          canDelete={user.profiles.length > 1}
        />
      )}
    </div>
  );
}

interface AddProfileModalProps {
  onClose: () => void;
  onAdd: (profile: Omit<UserProfile, 'id'>) => void;
}

function AddProfileModal({ onClose, onAdd }: AddProfileModalProps) {
  const [name, setName] = useState('');
  const [isKids, setIsKids] = useState(false);
  const [avatar] = useState(getRandomItem(AVATAR_COLORS));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        avatar,
        isKids,
        maturityLevel: isKids ? 'pg' : 'r',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-netflix-dark-gray rounded-lg p-8 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl text-white font-medium mb-6">Add Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div
              className="w-24 h-24 rounded flex items-center justify-center text-3xl font-bold text-white"
              style={{ backgroundColor: avatar }}
            >
              {name ? getInitials(name) : '?'}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-4 py-3 bg-[#333] text-white rounded focus:outline-none focus:ring-2 focus:ring-white"
              autoFocus
              required
            />
          </div>

          {/* Kids Profile Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isKids}
              onChange={e => setIsKids(e.target.checked)}
              className="w-5 h-5 accent-netflix-red"
            />
            <span className="text-white">Kids profile</span>
          </label>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-netflix-gray text-netflix-gray hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-white text-black hover:bg-netflix-red hover:text-white transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

function EditProfileModal({ profile, onClose, onSave, onDelete, canDelete }: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [isKids, setIsKids] = useState(profile.isKids);
  const [avatar, setAvatar] = useState(profile.avatar);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        ...profile,
        name: name.trim(),
        avatar,
        isKids,
        maturityLevel: isKids ? 'pg' : profile.maturityLevel,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-netflix-dark-gray rounded-lg p-8 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl text-white font-medium mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div
              className="w-24 h-24 rounded flex items-center justify-center text-3xl font-bold text-white cursor-pointer"
              style={{ backgroundColor: avatar }}
              onClick={() => setAvatar(getRandomItem(AVATAR_COLORS))}
              title="Click to change color"
            >
              {getInitials(name)}
            </div>
          </div>
          <p className="text-center text-netflix-gray text-sm">Click avatar to change color</p>

          {/* Name Input */}
          <div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-4 py-3 bg-[#333] text-white rounded focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {/* Kids Profile Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isKids}
              onChange={e => setIsKids(e.target.checked)}
              className="w-5 h-5 accent-netflix-red"
            />
            <span className="text-white">Kids profile</span>
          </label>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-netflix-gray text-netflix-gray hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-white text-black hover:bg-netflix-red hover:text-white transition-colors"
            >
              Save
            </button>
          </div>

          {/* Delete Button */}
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(profile.id)}
              className="w-full py-2 flex items-center justify-center gap-2 text-netflix-gray hover:text-red-500 transition-colors"
            >
              <FiTrash2 size={18} />
              <span>Delete Profile</span>
            </button>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}
