export interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
  referrer: string;
}

export function parseM3U(content: string): Channel[] {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const channels: Channel[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF:')) {
      const info = lines[i];
      let url = '';
      let referrer = '';

      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith('#EXTVLCOPT:http-referrer=')) {
          referrer = lines[j].replace('#EXTVLCOPT:http-referrer=', '');
        } else if (!lines[j].startsWith('#')) {
          url = lines[j];
          break;
        }
      }
      if (!url) continue;

      const nameMatch = info.match(/,(.+)$/);
      const logoMatch = info.match(/tvg-logo="([^"]*)"/);
      const groupMatch = info.match(/group-title="([^"]*)"/);

      channels.push({
        id: `ch-${channels.length}`,
        name: nameMatch?.[1]?.trim() || 'Unknown',
        logo: logoMatch?.[1] || '',
        group: groupMatch?.[1] || 'Uncategorized',
        url,
        referrer,
      });
    }
  }

  return channels;
}

export async function fetchAndParseM3U(playlistUrl: string): Promise<Channel[]> {
  const res = await fetch(playlistUrl);
  const text = await res.text();
  return parseM3U(text);
}
