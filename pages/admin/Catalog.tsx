import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import { SpecialSandwich, Ingredient, IngredientCategory, Extra } from '../../shared/api/adminTypes';
import { Modal } from '../../components/Modal';

export const Catalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SANDWICHES' | 'INGREDIENTS' | 'EXTRAS'>('SANDWICHES');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Catalog Management</h1>
        <p className="text-neutral-500">Manage your menu items, ingredients, and extras.</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-neutral-200 overflow-x-auto">
        {(['SANDWICHES', 'INGREDIENTS', 'EXTRAS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab 
                ? 'border-primary text-neutral-900' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab === 'SANDWICHES' ? 'Special Sandwiches' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-300">
        {activeTab === 'SANDWICHES' && <SpecialSandwichesTab />}
        {activeTab === 'INGREDIENTS' && <IngredientsTab />}
        {activeTab === 'EXTRAS' && <ExtrasTab />}
      </div>
    </div>
  );
};

const PlaceholderTab: React.FC<{ name: string }> = ({ name }) => (
  <div className="p-8 bg-white border border-neutral-200 rounded-2xl border-dashed flex items-center justify-center min-h-[300px]">
    <p className="text-neutral-400 font-medium">{name} management coming soon...</p>
  </div>
);

// --- Special Sandwiches Tab Implementation ---

interface SandwichFormValues {
  name: string;
  description: string;
  isActive: boolean;
}

const SpecialSandwichesTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SpecialSandwich | null>(null);

  const { data: sandwiches, isLoading } = useQuery({
    queryKey: ['admin', 'special-sandwiches'],
    queryFn: api.getAdminSpecialSandwiches,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SandwichFormValues>({
    defaultValues: { isActive: true }
  });

  React.useEffect(() => {
    if (editingItem) {
      reset({
        name: editingItem.name,
        description: editingItem.description,
        isActive: editingItem.isActive
      });
    } else {
      reset({ name: '', description: '', isActive: true });
    }
  }, [editingItem, reset, isModalOpen]);

  const createMutation = useMutation({
    mutationFn: api.createSpecialSandwich,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'special-sandwiches'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<SpecialSandwich> }) => 
      api.updateSpecialSandwich(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'special-sandwiches'] });
      setIsModalOpen(false);
      setEditingItem(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteSpecialSandwich,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'special-sandwiches'] });
    }
  });

  const onSubmit = (data: SandwichFormValues) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: SpecialSandwich) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sandwich forever?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (item: SpecialSandwich) => {
    updateMutation.mutate({ 
      id: item.id, 
      updates: { isActive: !item.isActive } 
    });
  };

  if (isLoading) {
    return <div className="text-center py-10 text-neutral-500">Loading catalog...</div>;
  }

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h3 className="font-bold text-neutral-700">All Items</h3>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
          >
            + New Sandwich
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-6 py-4 font-semibold text-neutral-500 w-1/4">Name</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 w-1/3">Description</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 w-24 text-center">Active</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sandwiches?.length === 0 && (
                 <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-neutral-400 italic">No sandwiches found. Add one!</td>
                 </tr>
              )}
              {sandwiches?.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-neutral-900">{item.name}</td>
                  <td className="px-6 py-4 text-neutral-500 truncate max-w-xs" title={item.description}>{item.description}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleToggleActive(item)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        item.isActive ? 'bg-green-500' : 'bg-neutral-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-neutral-600 hover:text-primary font-medium hover:bg-neutral-100 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-red-400 hover:text-red-600 font-medium hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Sandwich' : 'Create New Sandwich'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Name</label>
            <input 
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g. Chicken Delight"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Description</label>
            <textarea 
              {...register('description', { required: 'Description is required' })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none h-24 resize-none"
              placeholder="e.g. Grilled chicken with..."
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
             <input 
                type="checkbox" 
                id="formIsActive"
                {...register('isActive')}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
             />
             <label htmlFor="formIsActive" className="text-sm font-medium text-neutral-700 cursor-pointer select-none">
                Available for order (Active)
             </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-2 bg-primary text-black font-bold rounded-lg hover:brightness-105 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

// --- Ingredients Tab Implementation ---

interface IngredientFormValues {
  name: string;
  category: IngredientCategory;
  isActive: boolean;
}

const IngredientsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    query: '',
    category: 'ALL'
  });
  
  const [filterInput, setFilterInput] = useState({
    query: '',
    category: 'ALL'
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin', 'ingredients', filters],
    queryFn: () => api.getAdminIngredients(filters),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IngredientFormValues>({
    defaultValues: { isActive: true }
  });

  React.useEffect(() => {
    if (editingItem) {
      reset({
        name: editingItem.name,
        category: editingItem.category,
        isActive: editingItem.isActive
      });
    } else {
      reset({ name: '', category: 'BREAD', isActive: true });
    }
  }, [editingItem, reset, isModalOpen]);

  const createMutation = useMutation({
    mutationFn: api.createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ingredients'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Ingredient> }) => 
      api.updateIngredient(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ingredients'] });
      setIsModalOpen(false);
      setEditingItem(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ingredients'] });
    }
  });

  const onSubmit = (data: IngredientFormValues) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: Ingredient) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ingredient forever?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (item: Ingredient) => {
    updateMutation.mutate({ 
      id: item.id, 
      updates: { isActive: !item.isActive } 
    });
  };

  const handleApplyFilters = () => {
    setFilters(filterInput);
  };

  if (isLoading) {
    return <div className="text-center py-10 text-neutral-500">Loading ingredients...</div>;
  }

  return (
    <>
      <div className="mb-6 bg-white p-4 rounded-xl border border-neutral-200 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-bold text-neutral-500 uppercase">Search</label>
          <input 
            value={filterInput.query}
            onChange={e => setFilterInput(p => ({ ...p, query: e.target.value }))}
            className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Search ingredients..."
          />
        </div>
        <div className="w-full md:w-48 space-y-1">
          <label className="text-xs font-bold text-neutral-500 uppercase">Category</label>
          <select 
            value={filterInput.category}
            onChange={e => setFilterInput(p => ({ ...p, category: e.target.value }))}
            className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="BREAD">Bread</option>
            <option value="MEAT">Meat</option>
            <option value="VEGGIES">Veggies</option>
            <option value="SAUCE">Sauce</option>
          </select>
        </div>
        <button 
          onClick={handleApplyFilters}
          className="w-full md:w-auto px-6 py-2 bg-neutral-900 text-white font-bold rounded-lg hover:bg-black transition-colors"
        >
          Apply Filters
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h3 className="font-bold text-neutral-700">All Ingredients</h3>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
          >
            + New Ingredient
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-6 py-4 font-semibold text-neutral-500 w-1/4">Name</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 w-1/4">Category</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 w-24 text-center">Active</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items?.length === 0 && (
                 <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-neutral-400 italic">No ingredients found.</td>
                 </tr>
              )}
              {items?.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{item.name}</td>
                  <td className="px-6 py-4 text-neutral-500">
                    <span className="inline-block px-2 py-1 bg-neutral-100 rounded text-xs font-bold text-neutral-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleToggleActive(item)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        item.isActive ? 'bg-green-500' : 'bg-neutral-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-neutral-600 hover:text-primary font-medium hover:bg-neutral-100 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-red-400 hover:text-red-600 font-medium hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Ingredient' : 'Create New Ingredient'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Name</label>
            <input 
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g. Whole Grain Bread"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Category</label>
            <select 
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="BREAD">Bread</option>
              <option value="MEAT">Meat</option>
              <option value="VEGGIES">Veggies</option>
              <option value="SAUCE">Sauce</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
             <input 
                type="checkbox" 
                id="ingFormIsActive"
                {...register('isActive')}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
             />
             <label htmlFor="ingFormIsActive" className="text-sm font-medium text-neutral-700 cursor-pointer select-none">
                Available for order (Active)
             </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-2 bg-primary text-black font-bold rounded-lg hover:brightness-105 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

// --- Extras Tab Implementation ---

interface ExtraFormValues {
  name: string;
  isActive: boolean;
}

const ExtrasTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Extra | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin', 'extras'],
    queryFn: api.getAdminExtras,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExtraFormValues>({
    defaultValues: { isActive: true }
  });

  React.useEffect(() => {
    if (editingItem) {
      reset({
        name: editingItem.name,
        isActive: editingItem.isActive
      });
    } else {
      reset({ name: '', isActive: true });
    }
  }, [editingItem, reset, isModalOpen]);

  const createMutation = useMutation({
    mutationFn: api.createExtra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'extras'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Extra> }) => 
      api.updateExtra(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'extras'] });
      setIsModalOpen(false);
      setEditingItem(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteExtra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'extras'] });
    }
  });

  const onSubmit = (data: ExtraFormValues) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: Extra) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this extra forever?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (item: Extra) => {
    updateMutation.mutate({ 
      id: item.id, 
      updates: { isActive: !item.isActive } 
    });
  };

  if (isLoading) {
    return <div className="text-center py-10 text-neutral-500">Loading extras...</div>;
  }

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h3 className="font-bold text-neutral-700">All Extras</h3>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
          >
            + New Extra
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-6 py-4 font-semibold text-neutral-500 w-1/2">Name</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 w-24 text-center">Active</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items?.length === 0 && (
                 <tr>
                   <td colSpan={3} className="px-6 py-8 text-center text-neutral-400 italic">No extras found.</td>
                 </tr>
              )}
              {items?.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{item.name}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleToggleActive(item)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        item.isActive ? 'bg-green-500' : 'bg-neutral-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-neutral-600 hover:text-primary font-medium hover:bg-neutral-100 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-red-400 hover:text-red-600 font-medium hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Extra' : 'Create New Extra'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Name</label>
            <input 
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g. Apple"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
             <input 
                type="checkbox" 
                id="extFormIsActive"
                {...register('isActive')}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
             />
             <label htmlFor="extFormIsActive" className="text-sm font-medium text-neutral-700 cursor-pointer select-none">
                Available for order (Active)
             </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-2 bg-primary text-black font-bold rounded-lg hover:brightness-105 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
