
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, UserRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    email: string;
    name?: string;
    bio?: string;
    avatarUrl?: string;
  } | null>(null);
  
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Set form values
    setName(parsedUser.name || "");
    setBio(parsedUser.bio || "");
    setAvatarUrl(parsedUser.avatarUrl || "");
  }, [navigate]);
  
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    uploadImage(file);
  };
  
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    
    // In a real app, you would upload to a server here
    // For this demo, we'll simulate a delay and use local storage
    try {
      // Create a FileReader to read the file as a data URL
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // Simulate upload delay
        setTimeout(() => {
          const imageUrl = reader.result as string;
          setAvatarUrl(imageUrl);
          setIsUploading(false);
          toast({
            title: "Image uploaded successfully",
            description: "Your profile picture has been updated",
          });
        }, 1500);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user in localStorage
    if (user) {
      const updatedUser = {
        ...user,
        name,
        bio,
        avatarUrl,
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    }
  };
  
  if (!user) {
    return <div className="flex justify-center items-center min-h-[70vh]">Loading...</div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>
            Manage your personal information and account settings
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="relative cursor-pointer group" 
                onClick={handleAvatarClick}
              >
                <Avatar className="h-24 w-24">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={name || "User"} />
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <UserRound className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Click to upload a profile picture
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled 
                  className="bg-muted/50"
                />
              </div>
              
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-brand-purple hover:bg-brand-purple/90"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Save Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
