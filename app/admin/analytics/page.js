"use client";
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);

  const router = useRouter()

  const AuthorizeUser = async () => {
    try {
      const email = sessionStorage.getItem("userEmail")
      const response = await fetch("/api/auth/role", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        toast("You cannot access this page!")
        return router.push("/")
      }

      const data = await response.json()
      console.log(data)

      if (data.role !== "ADMIN") {
        return router.push("/unauthorized")
      }

      return router.push("/admin/dashboard")

    } catch (error) {
      console.error(error)
      toast("Something went wrong")
      return router.push("/")
    }
  }


  useEffect(() => {
    AuthorizeUser()
    async function fetchAnalytics() {
      try {
        const response = await axios.get("/api/admin/analytics");
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    }
    fetchAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
        <p className="text-xl text-white">Loading analytics...</p>
      </div>
    );
  }

  // KPI Cards
  const kpiCards = [
    { label: "Total Jobs", value: analytics.totalJobs },
    { label: "Total Students", value: analytics.totalStudents },
    { label: "Average Salary", value: analytics.averageSalary ? analytics.averageSalary.toFixed(2) : "N/A" },
    { label: "Avg. Placement Rate", value: analytics.avgPlacementRate ? analytics.avgPlacementRate.toFixed(2) + "%" : "N/A" },
  ];

  // Bar Chart for Jobs by Type
  const jobsByTypeChart = {
    labels: analytics.jobsByType.map((item) => item._id),
    datasets: [
      {
        label: "Jobs Count",
        data: analytics.jobsByType.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };

  const jobsByTypeOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Jobs by Type" },
    },
  };

  // Line Chart for Monthly Job Posting Trend
  const jobsTrendChart = {
    labels: analytics.jobsTrend.map((item) => item._id),
    datasets: [
      {
        label: "Jobs Trend",
        data: analytics.jobsTrend.map((item) => item.count),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.4)",
        fill: true,
      },
    ],
  };

  const jobsTrendOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Job Postings Trend" },
    },
  };

  // Pie Chart for Students by Batch
  const studentsByBatchChart = {
    labels: analytics.studentsByBatch.map((item) => item._id),
    datasets: [
      {
        label: "Students Count",
        data: analytics.studentsByBatch.map((item) => item.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const studentsByBatchOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Students by Batch" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Enhanced Navbar */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="IIIT Logo" className="w-12 h-12 rounded-full shadow-md" />
            <h1 className="text-white text-2xl font-bold">Placement Analytics</h1>
          </div>
          <nav className="space-x-6">
            <a href="/admin/dashboard" className="text-white hover:underline transition-colors">Dashboard</a>
            <a href="/admin/gallery" className="text-white hover:underline transition-colors">Gallery</a>
            <a href="/admin/job-postings" className="text-white hover:underline transition-colors">Job Postings</a>
            <a href="/admin/users" className="text-white hover:underline transition-colors">Users</a>
            <a href="/admin/profile" className="text-white hover:underline transition-colors">Profile</a>
          </nav>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Data Analytics Dashboard</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {kpiCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-2xl p-6 transform hover:scale-105 transition duration-300">
              <p className="text-gray-500 text-lg">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <Bar data={jobsByTypeChart} options={jobsByTypeOptions} />
          </div>
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <Line data={jobsTrendChart} options={jobsTrendOptions} />
          </div>
          <div className="bg-white rounded-xl shadow-2xl p-6 lg:col-span-2">
            <Pie data={studentsByBatchChart} options={studentsByBatchOptions} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto text-center text-gray-300">
          &copy; {new Date().getFullYear()} IIIT Vadodara. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

//app->admin->analytics->page.js