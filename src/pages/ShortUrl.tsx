import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import type { Analytics } from "../type/Analytics";



const ShortUrl = () => {
  const { urls, setUrls, user, fetchUrls } = useAppContext();
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [isOpen, setIsOpen] = useState(false)
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const openUrlDescription = async (shortUrl: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    const res = await axios.get(`/api/analytics/${shortUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(res.data);
  }

  const handleShorten = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    console.log(longUrl);
    if (!token) {
      alert("Please login first");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/url/create-short-url`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            originalUrl: longUrl,
          },
        }
      );

      console.log(res.data);
      if (res.status === 200) {
        setUrls([...urls, res.data])
      }
      fetchUrls();
      setLongUrl("")
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }


  };

  const handleCheck = async () => {
    const token = localStorage.getItem("token");

    if (!token || !shortUrl) {
      alert("Missing token or short code");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/url/${shortUrl}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          maxRedirects: 0, // VERY IMPORTANT
          validateStatus: (status) => status === 302 || status === 301,
        }
      );

      const redirectUrl = res.headers.location;

      if (redirectUrl) {
        window.open(redirectUrl, "_blank");
      } else {
        alert("Redirect URL not found");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to open short URL");
    }
  };


  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  useEffect(() => {
    if (user) {
      fetchUrls();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {!isOpen
        ? (
          <div className="max-w-2xl mx-auto">
            {/* HEADER */}
            <h1 className="text-3xl font-bold text-center mb-6">
              URL Shortener
            </h1>

            {/* INPUT CARD */}
            <div className="bg-white p-5 rounded-xl shadow-md mb-6">
              <input
                type="text"
                placeholder="Enter long URL here..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-3"
              />

              <button
                onClick={handleShorten}
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                {loading ? "Shortening..." : "Shorten URL"}
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-3">Check Short URL</h3>
              <input
                type="text"
                placeholder="Enter short URL here..."
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-3"
              />

              <button
                onClick={handleCheck}
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                {loading ? "Checking..." : "Check URL"}
              </button>
            </div>

            {/* SHORT URL LIST */}
            <div className="space-y-4">
              {urls.map((url) => (
                <div
                  key={url.urlId}
                  className="bg-white  rounded-2xl shadow-md border border-gray-100 
             hover:shadow-lg transition-all duration-200"
                >
                  {/* DATE */}
                  <div className="text-xs text-gray-400 mb-2 pt-2 px-4">
                    {new Date(url.createdAt).toLocaleString()}
                  </div>

                  {/* ORIGINAL URL */}
                  <p className="text-sm text-gray-700 mb-3 px-4">
                    <span className="font-semibold text-gray-900">
                      Original URL:
                    </span>{" "}
                    <span className="font-medium text-blue-600 break-all">
                      {url.original_url}
                    </span>
                  </p>

                  {/* SHORT URL */}
                  <div className="flex items-center gap-2 mb-3 px-4">
                    <span className="text-sm text-gray-600">
                      Short URL:
                    </span>
                    <span className="font-semibold text-red-600 break-all">
                      {url.short_code}
                    </span>
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between pt-3 border-t px-4 pb-2">
                    <div className="text-sm">
                      <span className="text-gray-600">
                        Clicks:
                      </span>{" "}
                      <span className="font-bold text-gray-900">
                        {url.clickCount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsOpen(true)
                          openUrlDescription(url.short_code)
                        }}
                        className="text-sm px-3 py-1.5 rounded-lg  cursor-pointer bg-black text-white transition"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => copyToClipboard(`${import.meta.env.VITE_API_URL}/api/url/${url.short_code}`)}
                        className="text-sm px-3 py-1.5 rounded-lg  cursor-pointer
                 bg-gray-100 hover:bg-gray-200 
                 text-gray-700 hover:text-black 
                 transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

              ))}

              {urls.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                  No shortened URLs yet
                </p>
              )}
            </div>
          </div>
        )
        :
        (
          <div className="max-w-2xl mx-auto">
            <button className="text-sm px-3 py-1.5 rounded-lg  cursor-pointer bg-black text-white transition" onClick={() => setIsOpen(false)}>Back</button>
            {analytics.length > 0 ? (
              <div className="space-y-4">
                {analytics.map((url) => (
                  <AnalyticsCard key={url.id} data={url} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No analytics data available
              </p>
            )}
          </div>
        )}
    </div>
  );
};

const AnalyticsCard = ({ data }: { data: Analytics }) => {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm 
                 hover:shadow-md transition-all duration-200 p-4"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">
          Short Code:{" "}
          <span className="text-red-600">{data.shortCode}</span>
        </span>

        <span className="text-xs text-gray-500">
          {new Date(data.clickedAt).toLocaleString()}
        </span>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-2 gap-y-3 text-sm">
        <div>
          <span className="text-gray-500">IP</span>
          <p className="font-medium text-gray-800">{data.ip}</p>
        </div>

        <div>
          <span className="text-gray-500">Country</span>
          <p className="font-medium text-gray-800">{data.country}</p>
        </div>

        <div>
          <span className="text-gray-500">Device</span>
          <p className="font-medium text-gray-800">{data.device}</p>
        </div>

        <div>
          <span className="text-gray-500">Browser</span>
          <p className="font-medium text-gray-800">{data.browser}</p>
        </div>
      </div>
    </div>
  );
};


export default ShortUrl;
