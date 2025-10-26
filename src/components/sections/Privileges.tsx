import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://functions.poehali.dev/7fc8d65c-7223-44b0-bea4-ccccee031904';

interface Privilege {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: string;
}

const Privileges = () => {
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [selectedPrivilege, setSelectedPrivilege] = useState<Privilege | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrivileges();
  }, []);

  const fetchPrivileges = async () => {
    try {
      const response = await fetch(`${API_URL}?action=privileges`);
      const data = await response.json();
      setPrivileges(data.privileges || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить привилегии',
        variant: 'destructive'
      });
    }
  };

  const handleOrder = async () => {
    if (!selectedPrivilege || !nickname.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privilege_id: selectedPrivilege.id,
          nickname: nickname.trim(),
          email: email.trim()
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Ваш заказ принят. Ожидайте выдачу привилегии'
        });
        setSelectedPrivilege(null);
        setNickname('');
        setEmail('');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заказ',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-primary uppercase tracking-wider">
            Привилегии
          </h2>
          <p className="text-xl text-muted-foreground">
            Получи преимущества на сервере
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {privileges.map((privilege, index) => (
            <Card
              key={privilege.id}
              className="bg-card/50 backdrop-blur-sm border-primary/30 p-6 hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center mb-4">
                <Icon name="Crown" className="text-accent mx-auto mb-3" size={40} />
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {privilege.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {privilege.description}
                </p>
                <div className="text-3xl font-bold text-accent mb-2">
                  {privilege.price}₽
                </div>
                <p className="text-sm text-muted-foreground">
                  {privilege.duration}
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {privilege.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Icon name="Check" className="text-primary mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => setSelectedPrivilege(privilege)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                Купить
              </Button>
            </Card>
          ))}
        </div>

        {selectedPrivilege && (
          <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm border-accent p-8 animate-scale-in">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Оформление заказа
                </h3>
                <p className="text-accent font-bold text-xl">
                  {selectedPrivilege.name} - {selectedPrivilege.price}₽
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nickname" className="text-foreground">
                    Ваш никнейм *
                  </Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Steve"
                    className="bg-background/50 border-primary/30 text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">
                    Email (необязательно)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-background/50 border-primary/30 text-foreground"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleOrder}
                  disabled={loading}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                >
                  {loading ? 'Обработка...' : 'Подтвердить'}
                </Button>
                <Button
                  onClick={() => setSelectedPrivilege(null)}
                  variant="outline"
                  className="flex-1 border-primary/30 text-foreground hover:bg-primary/10"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};

export default Privileges;
