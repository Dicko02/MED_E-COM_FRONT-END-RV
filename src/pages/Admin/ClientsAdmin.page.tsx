import { useState, useEffect, useCallback } from 'react';
import { Users, Trash2 } from 'lucide-react';
import { userApi } from '../../api/User/user.api';
import { useToast } from '../../context/ToastContext';
import { Loading } from '../../components/Complements/Loading';
import { EmptyState } from '../../components/Complements/EmptyState';
import { ConfirmDialog } from '../../components/Complements/ConfirmDialog';

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  number?: string;
  role: 'admin' | 'client';
}

export const ClientsAdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'clients' | 'admins'>('clients');
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const toast = useToast();

  /* ============================
     LOAD USERS
  ============================ */
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Erreur chargement utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  /* ============================
     DELETE USER
  ============================ */
  const handleDelete = async (id: string) => {
    try {
      await userApi.delete(id);
      toast.success('Utilisateur supprimé');
      loadUsers();
    } catch {
      toast.error('Erreur suppression');
    }
  };

  /* ============================
     FILTER BY ROLE
  ============================ */
  const filteredUsers = users.filter(
    (u) => u.role === (viewType === 'clients' ? 'client' : 'admin')
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Loading size="lg" text="Chargement des utilisateurs..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-light mb-8">Gestion des utilisateurs</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setViewType('clients')}
          className={`px-6 py-2 rounded-full transition ${
            viewType === 'clients'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Clients ({users.filter(u => u.role === 'client').length})
        </button>

        <button
          onClick={() => setViewType('admins')}
          className={`px-6 py-2 rounded-full transition ${
            viewType === 'admins'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Administrateurs ({users.filter(u => u.role === 'admin').length})
        </button>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={`Aucun ${viewType === 'clients' ? 'client' : 'administrateur'}`}
          description="Aucun utilisateur pour le moment"
        />
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {user.nom} {user.prenom}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.number || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button
                      aria-label={`Supprimer l'utilisateur ${user.nom} ${user.prenom}`}
                      onClick={() => setDeleteConfirm(user)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm._id)}
        title="Supprimer l'utilisateur ?"
        message={`Êtes-vous sûr de vouloir supprimer ${deleteConfirm?.nom} ${deleteConfirm?.prenom} ?`}
        confirmText="Supprimer"
        type="danger"
      />
    </div>
  );
};
