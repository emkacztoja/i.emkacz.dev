// @ts-nocheck
import { useEffect, useState } from 'react';
import { fetchAdminUrls, updateUrl, deleteUrl, setAdminApiKey, shortenUrl } from '../../lib/api';

export default function AdminUrls() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [createOriginal, setCreateOriginal] = useState('');
  const [createAlias, setCreateAlias] = useState('');
  const [createExpireDays, setCreateExpireDays] = useState(0);
  const perPage = 20;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminUrls({ page, perPage, q: q || undefined });
      setItems(res.items);
      setTotal(res.total);
      // reset selection for new page
      const sel: Record<string, boolean> = {};
      res.items.forEach((it: any) => { sel[it.shortId] = false; });
      setSelected(sel);
      setSelectAll(false);
    } catch (err: any) {
      // if unauthorized, clear key and redirect to login
      if (err?.status === 401) {
        setAdminApiKey(null);
        window.location.href = '/admin/login';
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleSelect = (shortId: string) => {
    setSelected((s) => ({ ...s, [shortId]: !s[shortId] }));
  };

  const toggleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    const newSel: Record<string, boolean> = {};
    items.forEach((it) => { newSel[it.shortId] = next; });
    setSelected(newSel);
  };

  const onToggle = async (shortId: string, isActive: boolean) => {
    await updateUrl(shortId, { isActive: !isActive });
    load();
  };

  const onDelete = async (shortId: string) => {
    if (!confirm('Delete this URL? This is irreversible.')) return;
    await deleteUrl(shortId);
    load();
  };

  const bulkDelete = async () => {
    const toDelete = Object.entries(selected).filter(([k, v]) => v).map(([k]) => k);
    if (toDelete.length === 0) {
      alert('No URLs selected');
      return;
    }
    if (!confirm(`Delete ${toDelete.length} selected URLs? This is irreversible.`)) return;
    setLoading(true);
    try {
      for (const shortId of toDelete) {
        try {
          await deleteUrl(shortId);
        } catch (err) {
          console.error('Failed to delete', shortId, err);
        }
      }
    } finally {
      setLoading(false);
      load();
    }
  };

  const bulkPurge = async () => {
    // Purge all URLs in the system (iterate pages)
    const confirmMsg = 'This will permanently DELETE ALL URLs in the system. This action is irreversible. Type DELETE to confirm.';
    const answer = prompt(confirmMsg);
    if (answer !== 'DELETE') {
      alert('Purge aborted');
      return;
    }

    if (!confirm('Final confirmation: delete ALL URLs? This cannot be undone.')) return;

    setLoading(true);
    try {
      let curPage = 1;
      while (true) {
        const res = await fetchAdminUrls({ page: curPage, perPage });
        const pageItems = res.items || [];
        if (!pageItems.length) break;
        for (const it of pageItems) {
          try {
            await deleteUrl(it.shortId);
          } catch (err) {
            console.error('Failed to delete', it.shortId, err);
          }
        }
        // stop when we've processed all items
        if (res.total <= curPage * perPage) break;
        curPage += 1;
      }
    } finally {
      setLoading(false);
      load();
    }
  };

  const onCreate = async () => {
    if (!createOriginal) {
      alert('Original URL is required');
      return;
    }
    setLoading(true);
    try {
      const payload: any = { originalUrl: createOriginal };
      if (createAlias) payload.customAlias = createAlias;
      if (createExpireDays) payload.expireDays = createExpireDays;
      await shortenUrl(payload);
      setCreateOriginal('');
      setCreateAlias('');
      setCreateExpireDays(0);
      load();
      alert('Short URL created');
    } catch (err) {
      console.error(err);
      alert('Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Admin - URLs</h2>
        <div>
          <button onClick={() => { setAdminApiKey(null); window.location.href = '/admin/login'; }} className="px-3 py-1 border rounded">Logout</button>
        </div>
      </div>

      {/* Create form */}
      <div className="mb-4 border p-3 rounded">
        <h3 className="font-medium mb-2">Create short URL</h3>
        <div className="space-y-2">
          <input className="w-full border rounded p-2" placeholder="Original URL" value={createOriginal} onChange={(e) => setCreateOriginal(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Custom alias (optional)" value={createAlias} onChange={(e) => setCreateAlias(e.target.value)} />
          <div>
            <label className="block text-sm font-medium mb-1">Expiration</label>
            <select className="border rounded p-2" value={createExpireDays} onChange={(e) => setCreateExpireDays(Number(e.target.value))}>
              <option value={0}>Permanent</option>
              <option value={1}>1 day</option>
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
            </select>
          </div>
          <div>
            <button onClick={onCreate} className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          className="w-full border rounded p-2"
          placeholder="Search by shortId or original URL"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="mt-2 flex gap-2">
          <button onClick={() => { setPage(1); load(); }} className="px-3 py-1 bg-blue-600 text-white rounded">Search</button>
          <button onClick={bulkDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete Selected</button>
          <button onClick={bulkPurge} className="px-3 py-1 bg-red-800 text-white rounded">Purge All</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-2"><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>
                <th className="text-left p-2">Short</th>
                <th className="text-left p-2">Original URL</th>
                <th className="text-left p-2">Clicks</th>
                <th className="text-left p-2">Active</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className={!it.isActive ? 'opacity-50' : ''}>
                  <td className="p-2"><input type="checkbox" checked={!!selected[it.shortId]} onChange={() => toggleSelect(it.shortId)} /></td>
                  <td className="p-2">{it.shortId}</td>
                  <td className="p-2 break-words max-w-md">{it.originalUrl}</td>
                  <td className="p-2">{it.clicks}</td>
                  <td className="p-2">{it.isActive ? 'Yes' : 'No'}</td>
                  <td className="p-2">{new Date(it.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    <button onClick={() => onToggle(it.shortId, it.isActive)} className="mr-2 px-2 py-1 border rounded">{it.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => onDelete(it.shortId)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div>Showing page {page} — {total} total</div>
        <div className="space-x-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 border rounded">Prev</button>
          <button onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
