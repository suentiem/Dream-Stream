# -*- coding: utf-8 -*- 

###########################################################################
## Python code generated with wxFormBuilder (version Jun  5 2014)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc

wx.ID_1 = 1000

###########################################################################
## Class MainFrame
###########################################################################

class MainFrame ( wx.Frame ):
	
	def __init__( self, parent ):
		wx.Frame.__init__ ( self, parent, id = wx.ID_ANY, title = u"Dream Stream", pos = wx.DefaultPosition, size = wx.Size( 421,137 ), style = wx.CAPTION|wx.CLOSE_BOX|wx.MINIMIZE_BOX|wx.SYSTEM_MENU|wx.TAB_TRAVERSAL )
		
		self.SetSizeHintsSz( wx.DefaultSize, wx.DefaultSize )
		
		bSizer1 = wx.BoxSizer( wx.VERTICAL )
		
		self.m_panel26 = wx.Panel( self, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, wx.TAB_TRAVERSAL )
		self.m_panel26.SetBackgroundColour( wx.SystemSettings.GetColour( wx.SYS_COLOUR_MENU ) )
		
		bSizer44 = wx.BoxSizer( wx.VERTICAL )
		
		self.m_panel25 = wx.Panel( self.m_panel26, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, wx.TAB_TRAVERSAL )
		bSizer36 = wx.BoxSizer( wx.VERTICAL )
		
		sbSizer1 = wx.StaticBoxSizer( wx.StaticBox( self.m_panel25, wx.ID_ANY, u"Status" ), wx.HORIZONTAL )
		
		
		sbSizer1.AddSpacer( ( 10, 0), 1, wx.EXPAND, 5 )
		
		self.m_status_server = wx.RadioButton( self.m_panel25, wx.ID_1, u"Server", wx.DefaultPosition, wx.DefaultSize, wx.RB_SINGLE )
		self.m_status_server.Enable( False )
		
		sbSizer1.Add( self.m_status_server, 0, wx.BOTTOM, 5 )
		
		
		sbSizer1.AddSpacer( ( 10, 0), 1, wx.EXPAND, 5 )
		
		
		bSizer36.Add( sbSizer1, 1, wx.EXPAND, 5 )
		
		
		bSizer36.AddSpacer( ( 10, 0), 1, wx.EXPAND, 5 )
		
		bSizer34 = wx.BoxSizer( wx.HORIZONTAL )
		
		
		bSizer34.AddSpacer( ( 10, 0), 1, wx.EXPAND, 5 )
		
		self.m_button_browser = wx.Button( self.m_panel25, wx.ID_ANY, u"Browser Page", wx.DefaultPosition, wx.DefaultSize, 0 )
		bSizer34.Add( self.m_button_browser, 0, wx.ALL, 5 )
		
		
		bSizer34.AddSpacer( ( 10, 0), 1, wx.EXPAND, 5 )
		
		self.m_button_config = wx.Button( self.m_panel25, wx.ID_ANY, u"Configuration", wx.DefaultPosition, wx.DefaultSize, 0 )
		bSizer34.Add( self.m_button_config, 0, wx.ALL, 5 )
		
		
		bSizer34.AddSpacer( ( 10, 0), 1, wx.EXPAND, 5 )
		
		self.m_button_files = wx.Button( self.m_panel25, wx.ID_ANY, u"Files", wx.DefaultPosition, wx.DefaultSize, 0 )
		bSizer34.Add( self.m_button_files, 0, wx.ALL, 5 )
		
		
		bSizer34.AddSpacer( ( 10, 0), 1, wx.EXPAND, 5 )
		
		
		bSizer36.Add( bSizer34, 1, wx.EXPAND, 5 )
		
		
		self.m_panel25.SetSizer( bSizer36 )
		self.m_panel25.Layout()
		bSizer36.Fit( self.m_panel25 )
		bSizer44.Add( self.m_panel25, 1, wx.EXPAND|wx.ALL, 8 )
		
		
		self.m_panel26.SetSizer( bSizer44 )
		self.m_panel26.Layout()
		bSizer44.Fit( self.m_panel26 )
		bSizer1.Add( self.m_panel26, 1, wx.EXPAND |wx.ALL, 0 )
		
		
		self.SetSizer( bSizer1 )
		self.Layout()
		
		self.Centre( wx.BOTH )
		
		# Connect Events
		self.m_button_browser.Bind( wx.EVT_BUTTON, self.m_event_button_browser )
		self.m_button_config.Bind( wx.EVT_BUTTON, self.m_event_button_config )
		self.m_button_files.Bind( wx.EVT_BUTTON, self.m_event_button_files )
	
	def __del__( self ):
		pass
	
	
	# Virtual event handlers, overide them in your derived class
	def m_event_button_browser( self, event ):
		event.Skip()
	
	def m_event_button_config( self, event ):
		event.Skip()
	
	def m_event_button_files( self, event ):
		event.Skip()
	

