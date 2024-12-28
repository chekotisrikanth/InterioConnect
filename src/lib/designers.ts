import { supabase } from './supabase';
import { Designer } from '../types';

export async function getDesigners(): Promise<Designer[]> {
  try {
    console.log('Fetching designer profiles...');
    const { data: designerProfiles, error: designerError } = await supabase
      .from('designer_profiles')
      .select(`
        *,
        profiles (
          name
        )
      `);

    if (designerError) {
      console.error('Error fetching designer profiles:', designerError);
      throw new Error(`Failed to fetch designer profiles: ${designerError.message}`);
    }

    console.log('Designer profiles:', designerProfiles);

    if (!designerProfiles?.length) {
      console.log('No designer profiles found');
      return [];
    }

    // Get portfolio images
    const { data: portfolioImages, error: imagesError } = await supabase
      .from('portfolio_images')
      .select('*')
      .in('designer_id', designerProfiles.map(d => d.id));

    if (imagesError) {
      console.error('Error fetching portfolio images:', imagesError);
      throw new Error(`Failed to fetch portfolio images: ${imagesError.message}`);
    }

    // Transform the data
    const designers: Designer[] = designerProfiles.map(profile => {
      const designerImages = portfolioImages
        ?.filter(img => img.designer_id === profile.id)
        .map(img => img.image_url) || [];

      return {
        id: profile.id,
        name: profile.profiles?.name || 'Designer',
        bio: profile.bio || '',
        services: profile.services || {
          fullRoomDesign: false,
          consultation: false,
          eDesign: false
        },
        pricing: {
          type: profile.pricing?.type || 'hourly',
          rate: profile.pricing?.rate || 0,
          price_per_unit: profile.price_per_unit || 0,
          price_unit: profile.price_unit || 'hour'
        },
        images: designerImages,
        is_approved: profile.is_approved || false,
        styles: profile.styles || [],
        room_types: profile.room_types || [],
        experience_level: profile.experience_level || 0,
        rating: profile.rating || 0,
        portfolio_types: profile.portfolio_types || [],
        completed_projects: profile.completed_projects || 0
      };
    });

    console.log('Transformed designers:', designers);
    return designers;
  } catch (error) {
    console.error('Error in getDesigners:', error);
    throw error;
  }
}
