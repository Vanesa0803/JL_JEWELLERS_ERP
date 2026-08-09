import {
  ArrowLeft,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Temporary frontend data.
  // Later this will come from the backend.
  const [formData, setFormData] = useState({
    name: "Rahul Sharma",
    mobile: "9876543210",
    email: "rahul.sharma@gmail.com",
    address: "Greater Noida, Uttar Pradesh",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    pincode: "201318",
    vip: true,
    status: "Active",
  });

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Backend API will be connected here later.
    console.log("Updated Customer:", {
      id,
      ...formData,
    });

    navigate(`/customers/${id}`);
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div className="flex items-start gap-3">

          <button
            type="button"
            onClick={() => navigate(`/customers/${id}`)}
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg border border-[#DED4CA] text-[#6F3E32] transition hover:bg-[#F7F3EE]"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#9B8E83]">
              Customer Management
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-[#2B2622]">
              Edit Customer
            </h1>

            <p className="mt-1 text-sm text-[#85786D]">
              Update customer information and preferences.
            </p>
          </div>

        </div>

      </div>


      {/* ================= FORM ================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ================= BASIC INFORMATION ================= */}

        <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

          <div className="mb-6">

            <h2 className="text-base font-semibold text-[#2B2622]">
              Basic Information
            </h2>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Update the customer's personal and contact information.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* Full Name */}

            <FormField
              label="Full Name"
              icon={User}
              required
            >
              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  handleChange("name", event.target.value)
                }
                required
                className="form-input"
                placeholder="Enter customer name"
              />
            </FormField>


            {/* Mobile */}

            <FormField
              label="Mobile Number"
              icon={Phone}
              required
            >
              <input
                type="tel"
                value={formData.mobile}
                onChange={(event) =>
                  handleChange("mobile", event.target.value)
                }
                required
                className="form-input"
                placeholder="Enter mobile number"
              />
            </FormField>


            {/* Email */}

            <FormField
              label="Email Address"
              icon={Mail}
            >
              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  handleChange("email", event.target.value)
                }
                className="form-input"
                placeholder="Enter email address"
              />
            </FormField>


            {/* Address */}

            <FormField
              label="Address"
              icon={MapPin}
            >
              <input
                type="text"
                value={formData.address}
                onChange={(event) =>
                  handleChange("address", event.target.value)
                }
                className="form-input"
                placeholder="Enter address"
              />
            </FormField>

          </div>

        </section>


        {/* ================= LOCATION ================= */}

        <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

          <div className="mb-6">

            <h2 className="text-base font-semibold text-[#2B2622]">
              Location Details
            </h2>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Update the customer's location information.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-3">

            <FormField label="City">
              <input
                type="text"
                value={formData.city}
                onChange={(event) =>
                  handleChange("city", event.target.value)
                }
                className="form-input"
                placeholder="Enter city"
              />
            </FormField>


            <FormField label="State">
              <input
                type="text"
                value={formData.state}
                onChange={(event) =>
                  handleChange("state", event.target.value)
                }
                className="form-input"
                placeholder="Enter state"
              />
            </FormField>


            <FormField label="Pincode">
              <input
                type="text"
                value={formData.pincode}
                onChange={(event) =>
                  handleChange("pincode", event.target.value)
                }
                className="form-input"
                placeholder="Enter pincode"
              />
            </FormField>

          </div>

        </section>


        {/* ================= CUSTOMER STATUS ================= */}

        <section className="rounded-2xl border border-[#E7DED3] bg-white p-5 sm:p-6">

          <div className="mb-6">

            <h2 className="text-base font-semibold text-[#2B2622]">
              Customer Preferences
            </h2>

            <p className="mt-1 text-xs text-[#9B8E83]">
              Manage customer status and VIP settings.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* Status */}

            <FormField label="Customer Status">

              <select
                value={formData.status}
                onChange={(event) =>
                  handleChange("status", event.target.value)
                }
                className="form-input"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

            </FormField>


            {/* VIP */}

            <div>

              <label className="mb-2 block text-sm font-medium text-[#4B423C]">
                VIP Customer
              </label>

              <button
                type="button"
                onClick={() =>
                  handleChange("vip", !formData.vip)
                }
                className={`flex h-11 w-full items-center justify-between rounded-xl border px-4 transition ${
                  formData.vip
                    ? "border-[#D7B65D] bg-[#FFF8E8]"
                    : "border-[#DED4CA] bg-white"
                }`}
              >

                <span className="flex items-center gap-2">

                  <Star
                    size={17}
                    className={
                      formData.vip
                        ? "text-[#A47A16]"
                        : "text-[#9B8E83]"
                    }
                    fill={
                      formData.vip
                        ? "currentColor"
                        : "none"
                    }
                  />

                  <span
                    className={`text-sm font-medium ${
                      formData.vip
                        ? "text-[#8A6A1F]"
                        : "text-[#665C54]"
                    }`}
                  >
                    {formData.vip
                      ? "VIP Customer"
                      : "Regular Customer"}
                  </span>

                </span>


                <span
                  className={`h-5 w-9 rounded-full p-0.5 transition ${
                    formData.vip
                      ? "bg-[#8A6A1F]"
                      : "bg-[#D6CCC2]"
                  }`}
                >

                  <span
                    className={`block h-4 w-4 rounded-full bg-white transition ${
                      formData.vip
                        ? "translate-x-4"
                        : "translate-x-0"
                    }`}
                  />

                </span>

              </button>

            </div>

          </div>

        </section>


        {/* ================= ACTIONS ================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-[#E7DED3] pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => navigate(`/customers/${id}`)}
            className="rounded-xl border border-[#DCCFC3] bg-white px-5 py-3 text-sm font-medium text-[#6F3E32] transition hover:bg-[#F7F3EE]"
          >
            Cancel
          </button>


          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#6F3E32] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D332A]"
          >
            <Save size={17} />
            Save Changes
          </button>

        </div>

      </form>

    </div>
  );
};


/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
  label,
  icon: Icon,
  required = false,
  children,
}) => {
  return (
    <div>

      <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#4B423C]">

        {Icon && (
          <Icon
            size={15}
            className="text-[#8A6A1F]"
          />
        )}

        {label}

        {required && (
          <span className="text-[#9B6B62]">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
};

export default EditCustomer;