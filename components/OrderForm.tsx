
import React, { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { OrderStatusTracker } from './OrderStatusTracker';
import { CustomSandwichBuilder } from './CustomSandwichBuilder';
import { CUSTOM_SANDWICH_RULES } from '../features/order/model/customSandwichRules';
import { IngredientCategory } from '../shared/api/mockTypes';

interface FormValues {
  // Employee Info
  firstName: string;
  lastName: string;
  departmentId: string;
  wingId: string;
  hasAllergies: boolean;
  allergiesText: string;
  pickupTime: string;

  // Sandwich Logic
  sandwichCount: '1' | '2';
  sandwichConfig: 'SPECIAL' | 'CUSTOM' | '2_SPECIAL' | '2_CUSTOM' | 'MIXED';
  
  // Selection Data
  selectedSpecialId: string;
  selectedIngredientIds: string[];
  
  // Extras & Notes
  selectedExtraIds: string[];
  notes: string;
}

export const OrderForm: React.FC = () => {
  const [orderId, setOrderId] = useState<string | null>(null);

  // Added watch to the destructuring to fix the "Cannot find name 'watch'" error.
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch
  } = useForm<FormValues>({
    defaultValues: {
      hasAllergies: false,
      pickupTime: '',
      sandwichCount: '1',
      sandwichConfig: 'SPECIAL',
      selectedIngredientIds: [],
      selectedExtraIds: [],
      notes: '',
    }
  });

  const { data: config } = useQuery({ queryKey: ['config'], queryFn: api.getOrderWindows });
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: api.getDepartments });
  const { data: wings } = useQuery({ queryKey: ['wings'], queryFn: api.getWings });
  const { data: specials } = useQuery({ queryKey: ['specials'], queryFn: api.getSpecialSandwiches });
  const { data: ingredients } = useQuery({ queryKey: ['ingredients'], queryFn: api.getIngredients });
  const { data: extras } = useQuery({ queryKey: ['extras'], queryFn: api.getExtras });

  const hasAllergies = useWatch({ control, name: 'hasAllergies' });
  const pickupTime = useWatch({ control, name: 'pickupTime' });
  const sandwichCount = useWatch({ control, name: 'sandwichCount' });
  const sandwichConfig = useWatch({ control, name: 'sandwichConfig' });
  const selectedIngredientIds = useWatch({ control, name: 'selectedIngredientIds' }) || [];
  const selectedExtraIds = useWatch({ control, name: 'selectedExtraIds' }) || [];

  const createOrderMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: (data) => {
      setOrderId(data.orderId);
    }
  });

  const shiftInfo = useMemo(() => {
    if (!pickupTime || !config) return null;
    const timeToMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const currentMinutes = timeToMinutes(pickupTime);
    const dayFrom = timeToMinutes(config.dayShift.from);
    const dayTo = timeToMinutes(config.dayShift.to);
    const isDayShift = currentMinutes >= dayFrom && currentMinutes <= dayTo;
    return { shift: isDayShift ? 'DAY' : 'NIGHT' };
  }, [pickupTime, config]);

  const validateCustomSandwich = (ids: string[]) => {
    if (!ingredients) return true;
    
    let isValid = true;
    const selectedIngredients = ingredients.filter(i => ids.includes(i.id));
    
    const categories = Object.keys(CUSTOM_SANDWICH_RULES) as IngredientCategory[];
    
    for (const cat of categories) {
      const rule = CUSTOM_SANDWICH_RULES[cat];
      const count = selectedIngredients.filter(i => i.category === cat).length;
      
      if (count < rule.min) {
        setError(`selectedIngredientIds` as any, { 
          type: 'manual', 
          message: `${rule.label}: at least ${rule.min} required` 
        });
        isValid = false;
      } else if (count > rule.max) {
        setError(`selectedIngredientIds` as any, { 
          type: 'manual', 
          message: `${rule.label}: maximum ${rule.max} allowed` 
        });
        isValid = false;
      }
    }
    
    if (isValid) clearErrors('selectedIngredientIds');
    return isValid;
  };

  const onSubmit = (data: FormValues) => {
    // Custom validation for ingredient categories if a CUSTOM sandwich is involved
    const needsCustomValidation = data.sandwichConfig.includes('CUSTOM') || data.sandwichConfig === 'MIXED';
    if (needsCustomValidation) {
      if (!validateCustomSandwich(data.selectedIngredientIds)) {
        return;
      }
    }

    // Transform to final data model
    const sandwiches = [];
    if (data.sandwichConfig === 'SPECIAL' || data.sandwichConfig === '2_SPECIAL') {
      sandwiches.push({ 
        type: 'SPECIAL', 
        id: data.selectedSpecialId, 
        quantity: data.sandwichConfig === '2_SPECIAL' ? 2 : 1 
      });
    } else if (data.sandwichConfig === 'CUSTOM' || data.sandwichConfig === '2_CUSTOM') {
      sandwiches.push({ 
        type: 'CUSTOM', 
        ingredientIds: data.selectedIngredientIds, 
        quantity: data.sandwichConfig === '2_CUSTOM' ? 2 : 1 
      });
    } else if (data.sandwichConfig === 'MIXED') {
      sandwiches.push({ type: 'SPECIAL', id: data.selectedSpecialId, quantity: 1 });
      sandwiches.push({ type: 'CUSTOM', ingredientIds: data.selectedIngredientIds, quantity: 1 });
    }

    createOrderMutation.mutate({
      ...data,
      sandwiches,
      shift: shiftInfo?.shift
    });
  };

  if (orderId) {
    return <OrderStatusTracker orderId={orderId} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-10">
      {/* 1. Employee Data */}
      <section>
        <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Данные сотрудника
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-700">Имя</label>
            <input
              {...register('firstName', { required: 'Имя обязательно' })}
              placeholder="Введите имя"
              className={`w-full px-4 py-2 bg-neutral-50 border ${errors.firstName ? 'border-red-500' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all`}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-700">Фамилия</label>
            <input
              {...register('lastName', { required: 'Фамилия обязательна' })}
              placeholder="Введите фамилию"
              className={`w-full px-4 py-2 bg-neutral-50 border ${errors.lastName ? 'border-red-500' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-700">Отдел</label>
            <select
              {...register('departmentId', { required: 'Выберите отдел' })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none"
            >
              <option value="">Выберите отдел...</option>
              {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutral-700">Корпус</label>
            <select
              {...register('wingId', { required: 'Выберите корпус' })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none"
            >
              <option value="">Выберите корпус...</option>
              {wings?.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* 2. Timing */}
      <section className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100">
        <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Время получения
        </h2>
        <div className="max-w-xs space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Время (HH:mm)</label>
          <input
            type="time"
            {...register('pickupTime', { 
              required: 'Укажите время',
              validate: (val) => {
                if (!config) return true;
                const timeToMin = (t: string) => {
                  const [h, m] = t.split(':').map(Number);
                  return h * 60 + m;
                };
                const m = timeToMin(val);
                const from = timeToMin(config.orderWindow.from);
                const to = timeToMin(config.orderWindow.to);
                if (m < from || m > to) return `Время должно быть между ${config.orderWindow.from} и ${config.orderWindow.to}`;
                return true;
              }
            })}
            className={`w-full px-4 py-3 bg-white border ${errors.pickupTime ? 'border-red-500' : 'border-neutral-200'} rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all`}
          />
          {errors.pickupTime && <p className="text-xs text-red-500 font-medium">{errors.pickupTime.message}</p>}
        </div>

        {shiftInfo?.shift === 'NIGHT' && !errors.pickupTime && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start animate-in zoom-in-95">
            <span className="text-xl">🌙</span>
            <div>
              <p className="text-amber-900 font-bold text-sm">Внимание: Ночная смена</p>
              <p className="text-amber-700 text-xs">Заказ будет оформлен на ночную смену (вне дневного интервала).</p>
            </div>
          </div>
        )}
      </section>

      {/* 3. Allergies */}
      <section className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="hasAllergies"
            {...register('hasAllergies')}
            className="w-5 h-5 accent-primary border-neutral-300 rounded focus:ring-primary"
          />
          <label htmlFor="hasAllergies" className="text-sm font-bold text-neutral-900 cursor-pointer">
            У меня есть аллергии
          </label>
        </div>
        {hasAllergies && (
          <div className="space-y-1">
            <textarea
              {...register('allergiesText', { required: hasAllergies ? 'Укажите аллергии' : false })}
              placeholder="Опишите ваши аллергии..."
              className={`w-full px-4 py-2 bg-white border ${errors.allergiesText ? 'border-red-500' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-primary outline-none h-20 transition-all`}
            />
          </div>
        )}
      </section>

      {/* 4. Sandwich Selection */}
      <section>
        <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Выбор сэндвичей
        </h2>

        {/* Quantity Selection */}
        <div className="space-y-4 mb-8">
          <label className="text-sm font-bold text-neutral-700 block">Сколько сэндвичей вы хотите?</label>
          <div className="flex gap-4">
            {[
              { val: '1', label: '1 сэндвич' },
              { val: '2', label: '2 сэндвича' }
            ].map(item => (
              <button
                key={item.val}
                type="button"
                onClick={() => {
                  setValue('sandwichCount', item.val as '1' | '2');
                  setValue('sandwichConfig', item.val === '1' ? 'SPECIAL' : '2_SPECIAL');
                }}
                className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold transition-all text-center ${
                  sandwichCount === item.val 
                  ? 'border-primary bg-primary/5 text-neutral-900' 
                  : 'border-neutral-100 bg-white text-neutral-400 hover:border-neutral-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Combination Selection */}
        {sandwichCount === '2' && (
          <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-top-2">
            <label className="text-sm font-bold text-neutral-700 block">Выберите комбинацию:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { val: '2_SPECIAL', label: '2 SPECIAL' },
                { val: '2_CUSTOM', label: '2 CUSTOM' },
                { val: 'MIXED', label: '1 SPECIAL + 1 CUSTOM' }
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setValue('sandwichConfig', item.val as any)}
                  className={`py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all ${
                    sandwichConfig === item.val 
                    ? 'border-primary bg-primary text-black' 
                    : 'border-neutral-100 bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* SPECIAL BLOCK */}
          {(sandwichConfig === 'SPECIAL' || sandwichConfig === '2_SPECIAL' || sandwichConfig === 'MIXED') && (
            <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 shadow-sm">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">Special Recipe</span>
                {sandwichConfig === '2_SPECIAL' && <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-full font-bold">x2 quantity</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Выберите рецепт</label>
                <select
                  {...register('selectedSpecialId', { 
                    required: (sandwichConfig.includes('SPECIAL') || sandwichConfig === 'MIXED') ? 'Выберите сэндвич' : false 
                  })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">Выберите из меню...</option>
                  {specials?.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {errors.selectedSpecialId && <p className="text-xs text-red-500 font-medium">{errors.selectedSpecialId.message}</p>}
              </div>
            </div>
          )}

          {/* CUSTOM BUILDER BLOCK */}
          {(sandwichConfig === 'CUSTOM' || sandwichConfig === '2_CUSTOM' || sandwichConfig === 'MIXED') && (
            <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-6 animate-in fade-in zoom-in-95 shadow-sm">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">Custom Builder</span>
                {sandwichConfig === '2_CUSTOM' && <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-full font-bold">x2 quantity</span>}
              </div>
              
              {ingredients && (
                <CustomSandwichBuilder
                  ingredients={ingredients}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  fieldName="selectedIngredientIds"
                />
              )}
              {errors.selectedIngredientIds && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-bold">{errors.selectedIngredientIds.message as string}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 5. Extras */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Дополнения
          </h2>
          <span className={`text-xs font-bold px-2 py-1 rounded ${selectedExtraIds.length >= 3 ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-500'}`}>
            Выбрано: {selectedExtraIds.length} / 3
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {extras?.map(extra => {
            const isSelected = selectedExtraIds.includes(extra.id);
            const isMaxReached = selectedExtraIds.length >= 3;
            const isDisabled = !isSelected && isMaxReached;

            return (
              <label 
                key={extra.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isSelected 
                  ? 'bg-primary/5 border-primary text-neutral-900' 
                  : isDisabled 
                    ? 'opacity-50 grayscale bg-neutral-50 border-neutral-100 cursor-not-allowed'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 cursor-pointer'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{extra.name}</span>
                </div>
                <input
                  type="checkbox"
                  value={extra.id}
                  disabled={isDisabled}
                  {...register('selectedExtraIds')}
                  className="w-5 h-5 accent-primary border-neutral-300 rounded focus:ring-primary"
                />
              </label>
            );
          })}
        </div>
        {selectedExtraIds.length >= 3 && (
            <p className="mt-2 text-xs text-amber-600 font-medium">Максимальное количество дополнений (3) достигнуто.</p>
        )}
      </section>

      {/* 6. Notes */}
      <section>
        <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Комментарий к заказу
        </h2>
        <textarea
          {...register('notes')}
          placeholder="Особые пожелания или уточнения..."
          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none h-28 transition-all"
        />
      </section>

      <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-neutral-100">
        <div className="text-neutral-400 text-sm italic">
          * Все заказы проходят обязательную проверку отделом логистики
        </div>
        <button
          type="submit"
          disabled={createOrderMutation.isPending}
          className={`w-full md:w-auto px-12 py-4 bg-primary text-black font-extrabold text-lg rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all ${createOrderMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {createOrderMutation.isPending ? 'Отправка...' : 'Подтвердить заказ'}
        </button>
      </div>
    </form>
  );
};
