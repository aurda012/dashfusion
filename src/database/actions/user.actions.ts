'use server';

import User from '@/database/models/user.model';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '../index';
import {
  CreateUserParams,
  DeleteUserParams,
  GetUserByClerkIdParams,
  UpdateUserParams,
} from './shared.types';

export async function getUserById(uid: string) {
  try {
    await connectToDatabase();
    const user = await User.findById(uid);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserByClerkId(params: GetUserByClerkIdParams) {
  try {
    await connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    console.log('Creating User', userData);
    await connectToDatabase();
    const newUser = await User.create(userData);
    console.log('Created User', newUser);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(updatedData: UpdateUserParams) {
  try {
    await connectToDatabase();
    const { clerkId, path, updateData } = updatedData;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error('User not found');
    }
    // TODO: delete all related data.
    const deleteUser = await User.findByIdAndDelete(user._id);
    return deleteUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
