-- Create user roles enum
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'municipal_analyst',
  'environmental_specialist',
  'gis_planner',
  'technologist',
  'policy_maker',
  'viewer'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table (security best practice - separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create waste_data table
CREATE TABLE public.waste_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality TEXT NOT NULL,
  waste_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  collection_date DATE NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wte_sites table for GIS mapping
CREATE TABLE public.wte_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  capacity DECIMAL NOT NULL,
  technology TEXT NOT NULL,
  status TEXT NOT NULL,
  environmental_score DECIMAL,
  economic_score DECIMAL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wte_monitoring_data table
CREATE TABLE public.wte_monitoring_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES public.wte_sites(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  primary_airflow DECIMAL,
  secondary_airflow DECIMAL,
  furnace_pressure DECIMAL,
  oxygen_level DECIMAL,
  co_level DECIMAL,
  co2_level DECIMAL,
  nox_level DECIMAL,
  so2_level DECIMAL,
  steam_flow DECIMAL,
  steam_temperature DECIMAL,
  steam_pressure DECIMAL,
  power_output DECIMAL,
  efficiency DECIMAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create technology_comparison table
CREATE TABLE public.technology_comparison (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity_range TEXT,
  efficiency DECIMAL,
  capital_cost DECIMAL,
  operating_cost DECIMAL,
  environmental_impact TEXT,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create scenario_simulations table
CREATE TABLE public.scenario_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  waste_input DECIMAL,
  technology TEXT,
  capacity DECIMAL,
  results JSONB,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wte_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wte_monitoring_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_comparison ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_simulations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only super_admin can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for waste_data
CREATE POLICY "Authenticated users can view waste data"
  ON public.waste_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Analysts and admins can insert waste data"
  ON public.waste_data FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'municipal_analyst') OR
    public.has_role(auth.uid(), 'environmental_specialist')
  );

CREATE POLICY "Analysts and admins can update waste data"
  ON public.waste_data FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'municipal_analyst')
  );

CREATE POLICY "Only super_admin can delete waste data"
  ON public.waste_data FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for wte_sites
CREATE POLICY "Authenticated users can view sites"
  ON public.wte_sites FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "GIS planners and admins can manage sites"
  ON public.wte_sites FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'gis_planner')
  );

-- RLS Policies for wte_monitoring_data
CREATE POLICY "Authenticated users can view monitoring data"
  ON public.wte_monitoring_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Technologists and admins can insert monitoring data"
  ON public.wte_monitoring_data FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'technologist')
  );

-- RLS Policies for technology_comparison
CREATE POLICY "Authenticated users can view technologies"
  ON public.technology_comparison FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Technologists and admins can manage technologies"
  ON public.technology_comparison FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'technologist')
  );

-- RLS Policies for scenario_simulations
CREATE POLICY "Users can view own simulations"
  ON public.scenario_simulations FOR SELECT
  TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can create simulations"
  ON public.scenario_simulations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own simulations"
  ON public.scenario_simulations FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete own simulations"
  ON public.scenario_simulations FOR DELETE
  TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_waste_data_updated_at
  BEFORE UPDATE ON public.waste_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wte_sites_updated_at
  BEFORE UPDATE ON public.wte_sites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_technology_comparison_updated_at
  BEFORE UPDATE ON public.technology_comparison
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scenario_simulations_updated_at
  BEFORE UPDATE ON public.scenario_simulations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  -- Assign default viewer role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();