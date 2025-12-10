import { useState, useEffect } from "react";
import { useUtility } from "../context/UtilityContext";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/ui/Form";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Settings as SettingsIcon, Save, User } from "lucide-react";

export default function SettingsPage() {
    const { waterRate, updateRate } = useUtility();
    const { user, updateProfile } = useAuth();

    // Configuration State
    const [rateInput, setRateInput] = useState(waterRate);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        phone: "",
        email: ""
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                username: user.username || "",
                phone: user.phone || "",
                email: user.email || ""
            });
        }
    }, [user]);

    const handleRateSave = (e) => {
        e.preventDefault();
        updateRate(rateInput);
        alert("Configuration saved successfully!");
    };

    const handleProfileSave = (e) => {
        e.preventDefault();
        updateProfile(profileData);
        alert("Profile updated successfully!");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                <p className="text-slate-500">Manage application configuration</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Admin Profile - Editable */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-slate-500" />
                            Admin Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileSave} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <Input
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Username</label>
                                <Input
                                    value={profileData.username}
                                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Phone</label>
                                <Input
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <Input
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Update Profile
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Configurations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRateSave} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Water Rate ($ per unit)</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={rateInput}
                                        onChange={(e) => setRateInput(e.target.value)}
                                    />
                                    <Button type="submit" className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Save
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">
                                    This rate will be applied to all future bill generations.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
