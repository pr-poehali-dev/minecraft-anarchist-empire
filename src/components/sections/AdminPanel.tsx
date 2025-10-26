import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://functions.poehali.dev/7fc8d65c-7223-44b0-bea4-ccccee031904';

interface AdminPanelProps {
  isAdmin: boolean;
  authToken: string | null;
  onLogin: (token: string) => void;
  onLogout: () => void;
}

interface Order {
  id: number;
  nickname: string;
  email: string;
  status: string;
  created_at: string;
  privilege_name: string;
  price: number;
}

interface Admin {
  id: number;
  username: string;
}

interface Privilege {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: string;
}

const AdminPanel = ({ isAdmin, authToken, onLogin, onLogout }: AdminPanelProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [newPrivilege, setNewPrivilege] = useState({
    name: '',
    description: '',
    price: 0,
    features: '',
    duration: ''
  });
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin && authToken) {
      fetchOrders();
      fetchAdmins();
      fetchPrivileges();
    }
  }, [isAdmin, authToken]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok && data.token) {
        onLogin(data.token);
        toast({ title: 'Успешно', description: 'Вход выполнен' });
      } else {
        toast({ title: 'Ошибка', description: 'Неверные данные', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}?action=orders`, {
        headers: { 'X-Auth-Token': authToken || '' }
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_URL}?action=admins`, {
        headers: { 'X-Auth-Token': authToken || '' }
      });
      const data = await response.json();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error('Failed to fetch admins', error);
    }
  };

  const fetchPrivileges = async () => {
    try {
      const response = await fetch(`${API_URL}?action=privileges`);
      const data = await response.json();
      setPrivileges(data.privileges || []);
    } catch (error) {
      console.error('Failed to fetch privileges', error);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`${API_URL}?action=order_status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        },
        body: JSON.stringify({ order_id: orderId, status })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Статус обновлён' });
        fetchOrders();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить статус', variant: 'destructive' });
    }
  };

  const createPrivilege = async () => {
    const features = newPrivilege.features.split('\n').filter(f => f.trim());
    
    try {
      const response = await fetch(`${API_URL}?action=privilege`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        },
        body: JSON.stringify({
          name: newPrivilege.name,
          description: newPrivilege.description,
          price: newPrivilege.price,
          features,
          duration: newPrivilege.duration
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Привилегия создана' });
        setNewPrivilege({ name: '', description: '', price: 0, features: '', duration: '' });
        fetchPrivileges();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать привилегию', variant: 'destructive' });
    }
  };

  const createAdmin = async () => {
    try {
      const response = await fetch(`${API_URL}?action=admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken || ''
        },
        body: JSON.stringify(newAdmin)
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Администратор добавлен' });
        setNewAdmin({ username: '', password: '' });
        fetchAdmins();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить администратора', variant: 'destructive' });
    }
  };

  if (!isAdmin) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-primary/30 p-8">
          <div className="text-center mb-6">
            <Icon name="Lock" className="text-primary mx-auto mb-4" size={48} />
            <h2 className="text-3xl font-bold text-primary mb-2">Вход в админ-панель</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-foreground">Логин</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/50 border-primary/30 text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="bg-background/50 border-primary/30 text-foreground"
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              Войти
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary uppercase">
            Админ-панель
          </h2>
          <Button onClick={onLogout} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            <Icon name="LogOut" className="mr-2" size={16} />
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-primary/30">
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Заказы
            </TabsTrigger>
            <TabsTrigger value="privileges" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Привилегии
            </TabsTrigger>
            <TabsTrigger value="admins" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Администраторы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 mt-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-card/50 backdrop-blur-sm border-primary/30 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon name="User" className="text-accent" size={20} />
                      <span className="font-bold text-foreground">{order.nickname}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.email && <div>Email: {order.email}</div>}
                      <div>Привилегия: {order.privilege_name}</div>
                      <div>Сумма: {order.price}₽</div>
                      <div>Дата: {new Date(order.created_at).toLocaleString('ru-RU')}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      disabled={order.status === 'completed'}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Выполнено
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      disabled={order.status === 'cancelled'}
                      className="border-destructive text-destructive hover:bg-destructive/10"
                    >
                      Отменить
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="privileges" className="space-y-6 mt-6">
            <Card className="bg-card/50 backdrop-blur-sm border-accent/50 p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Создать новую привилегию</h3>
              <div className="grid gap-4">
                <div>
                  <Label className="text-foreground">Название</Label>
                  <Input
                    value={newPrivilege.name}
                    onChange={(e) => setNewPrivilege({ ...newPrivilege, name: e.target.value })}
                    className="bg-background/50 border-primary/30 text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Описание</Label>
                  <Input
                    value={newPrivilege.description}
                    onChange={(e) => setNewPrivilege({ ...newPrivilege, description: e.target.value })}
                    className="bg-background/50 border-primary/30 text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground">Цена (₽)</Label>
                    <Input
                      type="number"
                      value={newPrivilege.price}
                      onChange={(e) => setNewPrivilege({ ...newPrivilege, price: Number(e.target.value) })}
                      className="bg-background/50 border-primary/30 text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Срок</Label>
                    <Input
                      value={newPrivilege.duration}
                      onChange={(e) => setNewPrivilege({ ...newPrivilege, duration: e.target.value })}
                      placeholder="Навсегда / 30 дней"
                      className="bg-background/50 border-primary/30 text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground">Возможности (каждая с новой строки)</Label>
                  <Textarea
                    value={newPrivilege.features}
                    onChange={(e) => setNewPrivilege({ ...newPrivilege, features: e.target.value })}
                    rows={5}
                    className="bg-background/50 border-primary/30 text-foreground"
                  />
                </div>
                <Button onClick={createPrivilege} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <Icon name="Plus" className="mr-2" size={16} />
                  Создать привилегию
                </Button>
              </div>
            </Card>

            <div className="grid gap-4">
              {privileges.map((priv) => (
                <Card key={priv.id} className="bg-card/50 backdrop-blur-sm border-primary/30 p-6">
                  <h4 className="text-xl font-bold text-primary mb-2">{priv.name}</h4>
                  <p className="text-muted-foreground text-sm mb-2">{priv.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-accent font-bold">{priv.price}₽</span>
                    <span className="text-muted-foreground">{priv.duration}</span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6 mt-6">
            <Card className="bg-card/50 backdrop-blur-sm border-accent/50 p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Добавить администратора</h3>
              <div className="grid gap-4">
                <div>
                  <Label className="text-foreground">Логин</Label>
                  <Input
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                    className="bg-background/50 border-primary/30 text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Пароль</Label>
                  <Input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="bg-background/50 border-primary/30 text-foreground"
                  />
                </div>
                <Button onClick={createAdmin} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <Icon name="UserPlus" className="mr-2" size={16} />
                  Добавить администратора
                </Button>
              </div>
            </Card>

            <div className="grid gap-4">
              {admins.map((admin) => (
                <Card key={admin.id} className="bg-card/50 backdrop-blur-sm border-primary/30 p-4 flex items-center gap-3">
                  <Icon name="Shield" className="text-accent" size={24} />
                  <span className="font-bold text-foreground">{admin.username}</span>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AdminPanel;
