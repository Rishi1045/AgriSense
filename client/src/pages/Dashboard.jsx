import React, { useState, useEffect, useRef } from 'react';
import * as Icons from '@phosphor-icons/react';
import { jsPDF } from 'jspdf';
import GlassCard from '../components/ui/GlassCard';
import PillButton from '../components/ui/PillButton';
import AdvisoryBox from '../components/AdvisoryBox';
import WeatherChart from '../components/charts/WeatherChart';
import { fetchWeather, fetchHistory } from '../services/api';

const Dashboard = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const advisoryRef = useRef(null);

    useEffect(() => {
        loadHistory();
    }, []);

    // Auto-scroll to advisories on mobile when data loads
    useEffect(() => {
        if (weatherData && window.innerWidth < 1024) {
            // Small timeout to ensure DOM is updated
            setTimeout(() => {
                advisoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 3500);
        }
    }, [weatherData]);

    const loadHistory = async () => {
        try {
            const data = await fetchHistory();
            setHistory(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!city) return;

        setLoading(true);
        setError(null);
        setWeatherData(null);

        try {
            const data = await fetchWeather(city);
            setWeatherData(data);
            loadHistory(); // Refresh history
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!weatherData) return;
        const doc = new jsPDF();

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(5, 150, 105); // Primary Green
        doc.text("AgriSense Advisory Report", 20, 20);

        // Date & Location
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Location: ${weatherData.weather.name}, ${weatherData.weather.sys.country} `, 20, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()} `, 20, 36);

        // Weather Metrics
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Current Weather", 20, 50);

        doc.setFontSize(12);
        doc.text(`Temperature: ${weatherData.weather.main.temp}°C`, 20, 60);
        doc.text(`Condition: ${weatherData.weather.weather[0].main} `, 20, 66);
        doc.text(`Humidity: ${weatherData.weather.main.humidity}% `, 20, 72);
        doc.text(`Wind Speed: ${weatherData.weather.wind.speed} m / s`, 20, 78);

        // Advisories
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Farmer Advisories", 20, 95);

        let yPos = 105;
        weatherData.advisories.forEach((advisory, index) => {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`${index + 1}. ${advisory.title} `, 20, yPos);
            yPos += 6;
            doc.setFont("helvetica", "normal");
            doc.text(advisory.message, 20, yPos);
            yPos += 10;
        });

        // Ensure filename is safe and ends with .pdf
        const safeCity = weatherData.weather.name.replace(/\s+/g, "_");
        const filename = `AgriSense_Advisory_${safeCity}.pdf`;
        doc.save(filename);
    };

    // Format chart data
    const chartData = weatherData?.forecast?.list?.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: item.main.temp,
    })) || [];

    return (
        <div className="min-h-screen p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
            {/* Hero / Header */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-6 py-2 animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-xl">
                        <Icons.Plant size={32} weight="fill" className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-extrabold text-slate-800 tracking-tight">
                            AgriSense
                        </h1>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Smart Weather Advisories</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 md:w-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Icons.MagnifyingGlass size={20} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search city..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full md:w-96 pl-12 pr-36 py-3.5 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body text-base shadow-sm group-hover:shadow-md"
                        />
                        <div className="absolute right-1.5 top-1.5 bottom-1.5">
                            <PillButton type="submit" isLoading={loading} className="h-full px-6 py-0 text-sm font-bold tracking-wide shadow-none hover:shadow-md">
                                Search
                            </PillButton>
                        </div>
                    </form>
                </div>
            </header>

            {/* Main Content */}
            <main className="animate-fade-in">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-card border border-red-100 flex items-center gap-2 font-medium text-sm mb-6 animate-fade-in">
                        <Icons.WarningCircle size={20} />
                        {error}
                    </div>
                )}

                {!weatherData && !loading ? (
                    /* EMPTY STATE LAYOUT */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Left: Welcome & Recent Searches */}
                        <div className="lg:col-span-2 space-y-8">
                            <GlassCard className="relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                    <div className="bg-slate-50 p-6 rounded-full">
                                        <Icons.CloudSun size={64} weight="duotone" className="text-slate-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-heading font-bold text-slate-800 mb-2">Ready to explore?</h2>
                                        <p className="text-slate-500 text-base leading-relaxed max-w-md">
                                            Enter a city above to get real-time weather, forecasts, and AI-powered farming advisories tailored to your location.
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>

                            <div>
                                <h3 className="text-lg font-heading font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Icons.ClockCounterClockwise size={20} weight="fill" className="text-primary" />
                                    Recent Searches
                                </h3>
                                {history.length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-slate-400 font-medium">No recent searches yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {history.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCity(item.city)}
                                                className="p-4 rounded-2xl bg-white/40 border border-slate-100 hover:border-primary/30 hover:bg-white/80 hover:shadow-lg hover:-translate-y-1 transition-all group text-left flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                                        <Icons.MapPin size={20} weight="fill" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-700 group-hover:text-primary transition-colors">{item.city}, {item.country}</p>
                                                        <p className="text-xs text-slate-400 font-medium">{new Date(item.searchDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className="text-lg font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 group-hover:border-primary/10">
                                                    {Math.round(item.temp)}°
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar: Features / Tips */}
                        <div className="space-y-6">
                            <GlassCard className="bg-gradient-to-br from-white/40 to-white/10">
                                <h3 className="text-lg font-heading font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Icons.Lightbulb size={20} weight="fill" className="text-yellow-500" />
                                    Did You Know?
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/30 transition-colors">
                                        <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
                                            <Icons.Drop size={20} weight="fill" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-700 text-sm">Smart Irrigation</h4>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Soil moisture data can help save up to 20% water usage.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/30 transition-colors">
                                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                            <Icons.Sun size={20} weight="fill" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-700 text-sm">Frost Alerts</h4>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Early warnings help protect sensitive crops from freeze damage.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/30 transition-colors">
                                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                            <Icons.Wind size={20} weight="fill" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-700 text-sm">Wind Planning</h4>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Avoid spraying pesticides on high wind days to prevent drift.</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                ) : (
                    /* DATA STATE LAYOUT */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Weather & Chart */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Weather Details Card */}
                            <GlassCard className="animate-fade-in relative overflow-hidden">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-100 pb-6">
                                    <div>
                                        <h2 className="text-4xl font-heading font-extrabold text-slate-800 tracking-tight">{weatherData?.weather.name}</h2>
                                        <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-2 text-sm uppercase tracking-wider">
                                            <Icons.MapPin size={16} weight="fill" className="text-primary" />
                                            {weatherData?.weather.sys.country}
                                        </p>
                                    </div>
                                    <div className="text-right mt-4 md:mt-0">
                                        <div className="text-5xl font-heading font-extrabold text-slate-800 flex items-start justify-end tracking-tighter">
                                            {Math.round(weatherData?.weather.main.temp)}
                                            <span className="text-3xl text-primary mt-1 font-bold">°C</span>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full mt-2">
                                            <Icons.Cloud size={14} weight="fill" className="text-slate-400" />
                                            <p className="text-slate-600 text-xs font-semibold capitalize">{weatherData?.weather.weather[0].description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Humidity</span>
                                            <Icons.Drop size={18} weight="fill" className="text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-2xl font-bold text-slate-700">{weatherData?.weather.main.humidity}%</span>
                                    </div>
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Wind</span>
                                            <Icons.Wind size={18} weight="fill" className="text-slate-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-2xl font-bold text-slate-700">{weatherData?.weather.wind.speed} <span className="text-sm font-medium text-slate-400">m/s</span></span>
                                    </div>
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Feels Like</span>
                                            <Icons.ThermometerSimple size={18} weight="fill" className="text-orange-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-2xl font-bold text-slate-700">{Math.round(weatherData?.weather.main.feels_like)}°</span>
                                    </div>
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Pressure</span>
                                            <Icons.Gauge size={18} weight="fill" className="text-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-2xl font-bold text-slate-700">{weatherData?.weather.main.pressure}</span>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Icons.TrendUp size={20} className="text-primary" />
                                        <h3 className="text-base font-heading font-bold text-slate-700">Temperature Trend (24h)</h3>
                                    </div>
                                    <WeatherChart data={chartData} />
                                </div>
                            </GlassCard>
                        </div>

                        {/* Right Column: Advisories & History */}
                        <div className="space-y-6" ref={advisoryRef}>
                            {/* Advisories */}
                            <GlassCard className="animate-fade-in">
                                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                    <h3 className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2">
                                        <Icons.Megaphone size={20} weight="fill" className="text-primary" />
                                        Advisories
                                    </h3>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="text-primary hover:text-primary-dark font-bold text-xs flex items-center gap-1.5 uppercase tracking-wide transition-colors"
                                    >
                                        <Icons.DownloadSimple size={16} weight="bold" /> Download
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {weatherData?.advisories?.length > 0 ? (
                                        weatherData.advisories.map((adv, idx) => (
                                            <AdvisoryBox
                                                key={idx}
                                                type={adv.type}
                                                title={adv.title}
                                                message={adv.message}
                                                icon={adv.icon}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                            <Icons.Checks size={32} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-xs font-medium">No critical advisories.</p>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>

                            {/* Recent Searches (Compact in Data State) */}
                            <GlassCard className="animate-fade-in">
                                <h3 className="text-sm font-heading font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
                                    <Icons.ClockCounterClockwise size={16} weight="bold" className="text-slate-400" />
                                    Recent Searches
                                </h3>
                                <div className="space-y-2">
                                    {history.length === 0 ? (
                                        <p className="text-slate-400 text-sm italic">No recent searches.</p>
                                    ) : (
                                        history.slice(0, 5).map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCity(item.city)}
                                                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                                        <Icons.MapPin size={14} weight="fill" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-700 group-hover:text-primary transition-colors">{item.city}, {item.country}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(item.searchDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                                    {Math.round(item.temp)}°
                                                </span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
