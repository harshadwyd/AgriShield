import { supabase } from './supabase';
import { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, userData?: Partial<ProfileInsert>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create profile if user was created successfully
    if (data.user && !error) {
      await this.createProfile(data.user.id, {
        email,
        ...userData,
      });
    }

    return data;
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Get current user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  // Get current session
  static async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  // Create user profile
  static async createProfile(userId: string, profileData: Partial<ProfileInsert>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: profileData.email!,
        full_name: profileData.full_name,
        farm_name: profileData.farm_name,
        farm_size: profileData.farm_size,
        farm_size_unit: profileData.farm_size_unit || 'hectares',
        location: profileData.location,
        primary_crops: profileData.primary_crops || [],
        experience_level: profileData.experience_level || 'beginner',
        preferred_language: profileData.preferred_language || 'en',
        preferred_units: profileData.preferred_units || 'metric',
        notifications_enabled: profileData.notifications_enabled ?? true,
        theme_preference: profileData.theme_preference || 'auto',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user profile
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist
        return null;
      }
      throw error;
    }

    return data;
  }

  // Update user profile
  static async updateProfile(userId: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Reset password
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  }

  // Update password
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}