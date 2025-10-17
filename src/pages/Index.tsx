import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'teacher' | 'student';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface Group {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  studentsCount: number;
  lessonsCount: number;
}

interface Lesson {
  id: string;
  groupId: string;
  title: string;
  description: string;
  dueDate: string;
  status?: 'completed' | 'pending' | 'checked';
  grade?: number;
}

interface Assignment {
  id: string;
  lessonId: string;
  studentId: string;
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

const Index = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.role === 'teacher') {
      setGroups([
        { id: '1', name: 'Математика 9А', description: 'Алгебра и геометрия', teacherId: currentUser.id, teacherName: currentUser.name, studentsCount: 24, lessonsCount: 12 },
        { id: '2', name: 'Физика 10Б', description: 'Механика и термодинамика', teacherId: currentUser.id, teacherName: currentUser.name, studentsCount: 18, lessonsCount: 8 },
      ]);
      setLessons([
        { id: '1', groupId: '1', title: 'Квадратные уравнения', description: 'Решить задачи 1-10 из учебника', dueDate: '2025-10-25' },
        { id: '2', groupId: '1', title: 'Теорема Пифагора', description: 'Доказать теорему и решить практические задачи', dueDate: '2025-10-28' },
      ]);
    } else if (currentUser?.role === 'student') {
      setGroups([
        { id: '1', name: 'Математика 9А', description: 'Алгебра и геометрия', teacherId: 'teacher1', teacherName: 'Иванова М.П.', studentsCount: 24, lessonsCount: 12 },
      ]);
      setLessons([
        { id: '1', groupId: '1', title: 'Квадратные уравнения', description: 'Решить задачи 1-10 из учебника', dueDate: '2025-10-25', status: 'completed', grade: 5 },
        { id: '2', groupId: '1', title: 'Теорема Пифагора', description: 'Доказать теорему и решить практические задачи', dueDate: '2025-10-28', status: 'pending' },
      ]);
    }
  }, [currentUser]);

  const handleLogin = (role: UserRole) => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === 'teacher' ? 'Мария Петровна' : 'Алексей Смирнов',
      email: role === 'teacher' ? 'teacher@school.com' : 'student@school.com',
      role,
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    toast({
      title: 'Добро пожаловать!',
      description: `Вы вошли как ${role === 'teacher' ? 'Учитель' : 'Ученик'}`,
    });
  };

  const handleCreateGroup = (name: string, description: string) => {
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      teacherId: currentUser!.id,
      teacherName: currentUser!.name,
      studentsCount: 0,
      lessonsCount: 0,
    };
    setGroups([...groups, newGroup]);
    toast({
      title: 'Группа создана!',
      description: `Группа "${name}" успешно создана`,
    });
  };

  const handleCreateLesson = (groupId: string, title: string, description: string, dueDate: string) => {
    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      groupId,
      title,
      description,
      dueDate,
    };
    setLessons([...lessons, newLesson]);
    setGroups(groups.map(g => g.id === groupId ? { ...g, lessonsCount: g.lessonsCount + 1 } : g));
    toast({
      title: 'Урок создан!',
      description: `Урок "${title}" добавлен в группу`,
    });
  };

  const handleSubmitAssignment = (lessonId: string, content: string) => {
    const newAssignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      lessonId,
      studentId: currentUser!.id,
      content,
      submittedAt: new Date().toISOString(),
    };
    setAssignments([...assignments, newAssignment]);
    setLessons(lessons.map(l => l.id === lessonId ? { ...l, status: 'completed' as const } : l));
    toast({
      title: 'Работа отправлена!',
      description: 'Ваша работа отправлена на проверку',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2">
              <Icon name="GraduationCap" size={32} className="text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">EduPlatform</CardTitle>
            <CardDescription>Образовательная платформа для учителей и учеников</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Пароль</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button onClick={() => handleLogin('teacher')} className="w-full bg-indigo-500 hover:bg-indigo-600">
                <Icon name="Users" size={18} className="mr-2" />
                Учитель
              </Button>
              <Button onClick={() => handleLogin('student')} className="w-full bg-purple-500 hover:bg-purple-600">
                <Icon name="User" size={18} className="mr-2" />
                Ученик
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">EduPlatform</h1>
              <p className="text-xs text-muted-foreground">{currentUser?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={currentUser?.role === 'teacher' ? 'default' : 'secondary'} className={`px-3 py-1 ${currentUser?.role === 'teacher' ? 'bg-indigo-500' : 'bg-purple-500'}`}>
              {currentUser?.role === 'teacher' ? 'Учитель' : 'Ученик'}
            </Badge>
            <Button variant="ghost" size="icon" onClick={() => setIsAuthenticated(false)}>
              <Icon name="LogOut" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="groups">
              <Icon name="Users" size={16} className="mr-2" />
              Группы
            </TabsTrigger>
            <TabsTrigger value="lessons">
              <Icon name="BookOpen" size={16} className="mr-2" />
              Уроки
            </TabsTrigger>
            <TabsTrigger value="progress">
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Прогресс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Мои группы</h2>
              {currentUser?.role === 'teacher' && (
                <CreateGroupDialog onCreate={handleCreateGroup} />
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-all hover:scale-105 duration-300 cursor-pointer border-2" onClick={() => setSelectedGroup(group.id)}>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span>{group.name}</span>
                      <Badge variant="outline" className="bg-indigo-50">{group.studentsCount} 👥</Badge>
                    </CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Уроков: {group.lessonsCount}</span>
                      <span className="text-muted-foreground">{group.teacherName}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Уроки и задания</h2>
              {currentUser?.role === 'teacher' && (
                <CreateLessonDialog groups={groups} onCreate={handleCreateLesson} />
              )}
            </div>
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="border-l-4 border-l-indigo-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{lesson.title}</CardTitle>
                        <CardDescription>{lesson.description}</CardDescription>
                      </div>
                      {lesson.status && (
                        <Badge variant={lesson.status === 'completed' ? 'default' : 'secondary'} className={lesson.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}>
                          {lesson.status === 'completed' ? '✓ Выполнено' : '⏱ Ожидает'}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={16} />
                          Срок: {new Date(lesson.dueDate).toLocaleDateString('ru-RU')}
                        </span>
                        {lesson.grade && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <Icon name="Star" size={16} />
                            Оценка: {lesson.grade}
                          </span>
                        )}
                      </div>
                      {currentUser?.role === 'student' && !lesson.status && (
                        <SubmitAssignmentDialog lessonId={lesson.id} onSubmit={handleSubmitAssignment} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Прогресс обучения</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Общая успеваемость</CardTitle>
                  <CardDescription>Средний балл по всем предметам</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">4.8</div>
                  <Progress value={96} className="h-2" />
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">12</div>
                      <div className="text-xs text-muted-foreground">Выполнено</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">3</div>
                      <div className="text-xs text-muted-foreground">В процессе</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">2</div>
                      <div className="text-xs text-muted-foreground">Просрочено</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Активность</CardTitle>
                  <CardDescription>Последние 7 дней</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { day: 'Пн', value: 80 },
                      { day: 'Вт', value: 60 },
                      { day: 'Ср', value: 100 },
                      { day: 'Чт', value: 40 },
                      { day: 'Пт', value: 90 },
                      { day: 'Сб', value: 20 },
                      { day: 'Вс', value: 30 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8">{item.day}</span>
                        <Progress value={item.value} className="h-2" />
                        <span className="text-xs text-muted-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function CreateGroupDialog({ onCreate }: { onCreate: (name: string, description: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (name && description) {
      onCreate(name, description);
      setName('');
      setDescription('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-500 hover:bg-indigo-600">
          <Icon name="Plus" size={16} className="mr-2" />
          Создать группу
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая группа</DialogTitle>
          <DialogDescription>Создайте группу для учеников</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Название группы</Label>
            <Input placeholder="Математика 9А" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea placeholder="Алгебра и геометрия" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} className="w-full bg-indigo-500 hover:bg-indigo-600">Создать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateLessonDialog({ groups, onCreate }: { groups: Group[], onCreate: (groupId: string, title: string, description: string, dueDate: string) => void }) {
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (groupId && title && description && dueDate) {
      onCreate(groupId, title, description, dueDate);
      setGroupId('');
      setTitle('');
      setDescription('');
      setDueDate('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-500 hover:bg-indigo-600">
          <Icon name="Plus" size={16} className="mr-2" />
          Создать урок
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый урок</DialogTitle>
          <DialogDescription>Добавьте урок и задание для группы</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Группа</Label>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите группу" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Название урока</Label>
            <Input placeholder="Квадратные уравнения" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Описание задания</Label>
            <Textarea placeholder="Решить задачи 1-10 из учебника" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Срок сдачи</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} className="w-full bg-indigo-500 hover:bg-indigo-600">Создать урок</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SubmitAssignmentDialog({ lessonId, onSubmit }: { lessonId: string, onSubmit: (lessonId: string, content: string) => void }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content) {
      onSubmit(lessonId, content);
      setContent('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
          <Icon name="Send" size={16} className="mr-2" />
          Сдать работу
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отправить работу</DialogTitle>
          <DialogDescription>Добавьте ваше решение или ответ</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Ваш ответ</Label>
            <Textarea 
              placeholder="Введите решение задачи или прикрепите ссылку..." 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full bg-emerald-500 hover:bg-emerald-600">Отправить на проверку</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Index;
