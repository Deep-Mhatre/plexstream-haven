
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Home, Settings, CreditCard, History, LogOut } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, isAuthenticated, navigate]);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save profile changes
    alert('Profile updated successfully!');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!isAuthenticated || !user) {
    return null; // Don't render if not authenticated
  }
  
  const getPlanName = () => {
    if (!user.subscription) return 'No active plan';
    
    return user.subscription.plan === 'basic' 
      ? 'Basic Plan' 
      : user.subscription.plan === 'standard'
        ? 'Standard Plan'
        : 'Premium Plan';
  };
  
  const getDevicesAllowed = () => {
    if (!user.subscription) return 0;
    
    return user.subscription.plan === 'basic' 
      ? 1 
      : user.subscription.plan === 'standard'
        ? 2
        : 4;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                <Avatar className="h-14 w-14">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start" disabled>
                  <Mail className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start" disabled>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Button>
                <Button variant="ghost" className="w-full justify-start" disabled>
                  <History className="mr-2 h-4 w-4" />
                  Watch History
                </Button>
                <Button variant="ghost" className="w-full justify-start" disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="account">
                <TabsList className="mb-6">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                </TabsList>
                
                {/* Account Tab */}
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>
                        Manage your account details and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveProfile}>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                              id="name" 
                              value={name} 
                              onChange={e => setName(e.target.value)} 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={email} 
                              onChange={e => setEmail(e.target.value)} 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                              id="password" 
                              type="password" 
                              placeholder="••••••••" 
                              disabled 
                            />
                            <p className="text-sm text-muted-foreground">
                              Password changes are disabled in this demo.
                            </p>
                          </div>
                        </div>
                        
                        <Button type="submit" className="mt-6">
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Subscription Tab */}
                <TabsContent value="subscription">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Details</CardTitle>
                      <CardDescription>
                        Manage your current plan and payment information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between p-6 bg-muted rounded-lg">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                            <div className="flex items-center">
                              <h3 className="text-xl font-semibold mr-2">{getPlanName()}</h3>
                              <Badge variant="outline" className="ml-2">
                                {getDevicesAllowed()} {getDevicesAllowed() === 1 ? 'device' : 'devices'}
                              </Badge>
                            </div>
                          </div>
                          
                          {user.subscription && (
                            <div className="mt-4 md:mt-0">
                              <p className="text-sm text-muted-foreground mb-1">Valid Until</p>
                              <p>
                                {new Date(user.subscription.validUntil).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                          <div className="p-6 border border-border rounded-lg flex justify-between items-center">
                            <div className="flex items-center">
                              <CreditCard className="h-8 w-8 mr-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/25</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>
                              Change
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Payment method changes are disabled in this demo.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                          <div className="border border-border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-3 text-left">Date</th>
                                  <th className="px-4 py-3 text-left">Amount</th>
                                  <th className="px-4 py-3 text-left">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t border-border">
                                  <td className="px-4 py-3">May 1, 2023</td>
                                  <td className="px-4 py-3">₹129.00</td>
                                  <td className="px-4 py-3">
                                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                      Paid
                                    </Badge>
                                  </td>
                                </tr>
                                <tr className="border-t border-border">
                                  <td className="px-4 py-3">Apr 1, 2023</td>
                                  <td className="px-4 py-3">₹129.00</td>
                                  <td className="px-4 py-3">
                                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                      Paid
                                    </Badge>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => navigate('/pricing')}>
                        Change Plan
                      </Button>
                      <Button variant="destructive" disabled>
                        Cancel Subscription
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-background border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PLEXSTREAM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
