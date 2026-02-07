import { useEffect } from 'react';
import ShareMenu from 'react-native-share-menu';

export default function ShareHandler({ onShareReceived }) {
  useEffect(() => {
    const fetchTitleFromUrl = async (url) => {
      try {
        console.log('🔍 Fetching title from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!response.ok) {
          console.log('⚠️ Failed to fetch URL:', response.status);
          return null;
        }

        const html = await response.text();
        
        // Extract title from HTML
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          const title = titleMatch[1].trim();
          console.log('✅ Extracted title:', title);
          return title;
        }

        // Try og:title meta tag as fallback
        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          const title = ogTitleMatch[1].trim();
          console.log('✅ Extracted og:title:', title);
          return title;
        }

        console.log('⚠️ No title found in HTML');
        return null;
      } catch (error) {
        console.log('❌ Error fetching title:', error.message);
        return null;
      }
    };

    const handleShare = async (share) => {
      console.log('📤 Share received:', share);
      
      if (!share.data) {
        console.log('⚠️ No data in share');
        return;
      }

      // Extract URL from shared data
      let url = '';
      let title = '';

      if (typeof share.data === 'string') {
        // Check if it's a URL
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = share.data.match(urlRegex);
        
        if (matches && matches.length > 0) {
          url = matches[0];
          // Use remaining text as title if available
          title = share.data.replace(url, '').trim();
        } else {
          // If not a URL, treat entire text as content
          title = share.data.trim();
        }
      }

      // Extract title from URL if no title provided
      if (!title && url) {
        try {
          const urlObj = new URL(url);
          title = urlObj.hostname.replace('www.', '');
        } catch (error) {
          title = 'Shared Resource';
        }
      }

      console.log('✅ Processed share:', { url, title });

      // Send initial data immediately (with placeholder title if needed)
      if (onShareReceived) {
        onShareReceived({
          url: url || share.data,
          title: title || 'Loading title...',
          fromShare: true,
        });
      }

      // Fetch actual title from URL in background
      if (url) {
        fetchTitleFromUrl(url).then((fetchedTitle) => {
          if (fetchedTitle && onShareReceived) {
            console.log('🔄 Updating with fetched title:', fetchedTitle);
            onShareReceived({
              url: url,
              title: fetchedTitle,
              fromShare: true,
              isUpdate: true,
            });
          }
        });
      }
    };

    // Handle initial share (when app is opened via share intent)
    ShareMenu.getInitialShare((share) => {
      if (!share) return;
      
      handleShare(share);
    });

    // Listen for new shares (when app is already open)
    const listener = ShareMenu.addNewShareListener((share) => {
      if (!share) return;
      
      handleShare(share);
    });

    return () => {
      listener.remove();
    };
  }, [onShareReceived]);

  return null; // This is a logic-only component
}
