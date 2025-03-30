
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Settings, Clock, Heart, List, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import WatchList from '@/components/WatchList';
import UserHistory from '@/components/UserHistory';
import { getUserHistory } from '@/services/api/details';

interface UserProfileProps {
  className?: string;
}

const UserProfile = ({ className }: UserProfileProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  const history = user ? getUserHistory(user.id) : [];
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate('/');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const getSubscriptionBadgeColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-purple-600 text-white';
      case 'standard':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  if (!user) {
    return (
      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-lg mb-4">Please log in to view your profile</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <Tabs defaultValue="profile" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Account</h1>
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Watch List</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {user.email}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getSubscriptionBadgeColor(user.subscription?.plan || 'basic')}`}>
                      {(user.subscription?.plan || 'basic').toUpperCase()}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-muted-foreground">Account Details</h3>
                  <p>Member since: {formatDate(user.createdAt || new Date().toISOString())}</p>
                  <p>
                    Subscription: {user.subscription?.plan.charAt(0).toUpperCase() + user.subscription?.plan.slice(1) || 'Basic'} Plan
                  </p>
                  <p>
                    Valid until: {user.subscription?.validUntil 
                      ? formatDate(user.subscription.validUntil) 
                      : formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-muted-foreground">Activity Summary</h3>
                  <p>Watch history: {history.length} items</p>
                  <p>Favorites: {0} items</p>
                  <p>Reviews: {0}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium text-muted-foreground mb-2">Subscription Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>
                      {user.subscription?.plan === 'premium' 
                        ? 'Ad-free 4K streaming' 
                        : user.subscription?.plan === 'standard' 
                          ? 'HD streaming with limited ads' 
                          : 'SD streaming with ads'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>
                      {user.subscription?.plan === 'premium' 
                        ? 'Download on 5 devices' 
                        : user.subscription?.plan === 'standard' 
                          ? 'Download on 2 devices' 
                          : 'No downloads'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>
                      {user.subscription?.plan === 'premium' 
                        ? 'Watch on 4 screens at once' 
                        : user.subscription?.plan === 'standard' 
                          ? 'Watch on 2 screens at once' 
                          : 'Watch on 1 screen at a time'}
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/pricing')}
              >
                Upgrade Plan
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="watchlist">
          <WatchList />
        </TabsContent>
        
        <TabsContent value="history">
          <UserHistory />
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md mt-1"
                      defaultValue={user.name}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border rounded-md mt-1"
                      defaultValue={user.email}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Preferences</h3>
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Auto-play next episode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Auto-play previews</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Change Password</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full p-2 border rounded-md mt-1"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">New Password</label>
                    <input 
                      type="password" 
                      className="w-full p-2 border rounded-md mt-1"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full p-2 border rounded-md mt-1"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => {
                  toast({
                    title: "Settings saved",
                    description: "Your account settings have been updated"
                  });
                }}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
