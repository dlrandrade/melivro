import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import MetaTags from '../components/MetaTags';
import { ImageUpload } from '../components/admin/ImageUpload';

interface ProfileData {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  reading_goal_2024: number;
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    bio: '',
    avatar_url: ''
  });
  const [userActivities, setUserActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    checkUser();
    fetchUserActivities();
  }, [username]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        username: data.username || '',
        email: data.email || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivities = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('activities')
        .select('*, profiles(*), books(*), notable_people(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const updates = {
        id: currentUser.id,
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      setProfile({ ...profile, ...updates } as ProfileData);
      setIsEditing(false);

      // If username changed, we might need to redirect, but let's keep it simple for now
      if (formData.username !== username) {
        window.location.href = `/profile/${formData.username}`;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil.');
    }
  };

  if (loading) return <div className="p-12 text-center">Carregando perfil...</div>;
  if (!profile) return <div className="p-12 text-center">Perfil não encontrado.</div>;

  const isOwner = currentUser && currentUser.id === profile.id;

  return (
    <>
      <MetaTags
        title={`${profile.full_name} (@${profile.username}) | MeLivro`}
        description={profile.bio || `Confira o perfil de ${profile.full_name} no MeLivro.`}
        imageUrl={profile.avatar_url}
      />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12 relative group">
          <div className="relative">
            <img
              src={profile.avatar_url || 'https://via.placeholder.com/150'}
              alt={profile.full_name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
            />
          </div>

          <div className="flex-1">
            <h1 className="font-serif text-5xl font-bold text-black tracking-tighter mb-2">{profile.full_name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <p className="text-gray-500 text-lg">@{profile.username}</p>
              {profile.email && <p className="text-gray-400 text-sm">{profile.email}</p>}
            </div>
            {profile.bio && <p className="text-gray-700 max-w-xl">{profile.bio}</p>}
          </div>

          <div className="flex flex-col items-center gap-2">
            {isOwner && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Editar Perfil
              </button>
            )}
            <div className="flex gap-4 mt-4">
              <div className="text-center">
                <span className="block font-bold text-xl">{userActivities.length}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Posts</span>
              </div>
              <div className="text-center border-l border-gray-200 pl-4">
                <span className="block font-bold text-xl">{profile.reading_goal_2024 || 0}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Meta 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-xl">Editar Perfil</h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-black">&times;</button>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto de Perfil</label>
                  <ImageUpload
                    label="Avatar (Upload ou URL)"
                    folder="avatars"
                    initialUrl={formData.avatar_url}
                    onUploadComplete={(url) => setFormData({ ...formData, avatar_url: url })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome de Usuário (@)</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none h-24 resize-none"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-500 font-bold text-sm hover:text-black">Cancelar</button>
                  <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <hr className="my-12 border-[var(--border-color)]" />

        <div className="space-y-8">
          <h2 className="font-serif text-3xl font-bold mb-8">Atividades</h2>
          {userActivities.length > 0 ? (
            <div className="grid gap-6">
              {userActivities.map((act) => (
                <div key={act.id} className="bg-white p-6 rounded-lg border border-[var(--border-color)] shadow-sm">
                  {act.activity_type === 'text_post' && (
                    <div>
                      <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">{act.payload?.text}</p>
                      <span className="text-xs text-gray-400 mt-4 block">
                        {new Date(act.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  )}
                  {act.activity_type === 'status_update' && act.books && (
                    <div className="flex gap-4">
                      <img src={act.books.cover_url} alt={act.books.title} className="w-16 h-24 object-cover rounded" />
                      <div>
                        <p className="text-gray-900 font-bold">{act.books.title}</p>
                        <p className="text-sm text-gray-500">Marque como {act.payload?.status}</p>
                        <span className="text-xs text-gray-400 mt-2 block">
                          {new Date(act.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 border border-dashed border-[var(--border-color)] rounded-xl">
              <p className="text-gray-500 font-semibold">Nenhuma atividade registrada ainda.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;